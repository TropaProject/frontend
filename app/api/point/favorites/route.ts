import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';
import { cookies } from 'next/headers';

// Функция для обновления токена
async function refreshAuthToken(refreshToken: string): Promise<{ access: string; refresh?: string } | null> {
  try {
    console.log('[token-refresh] Attempting token refresh...');
    
    const refreshUrl = `${API_BASE_URL}/auth/refresh`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    console.log('[token-refresh] Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[token-refresh] Token refresh successful');
      return data;
    }
    
    console.log('[token-refresh] Token refresh failed:', response.status);
    return null;
    
  } catch (error) {
    console.error('[token-refresh] Error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    let authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[api/point/favorites] No authorization header');
      return NextResponse.json(
        { 
          status: 'error', 
          error: 'Unauthorized' 
        }, 
        { status: 401 }
      );
    }

    console.log('[api/point/favorites] Authorization header found');
    const url = `${API_BASE_URL}/point/favorites/`;
    
    // ПЕРВАЯ ПОПЫТКА - с текущим токеном
    let backendResponse = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await backendResponse.text();
    let backendData: any = {};
    
    try {
      if (responseText) {
        backendData = JSON.parse(responseText);
      }
    } catch {
      console.log('[api/point/favorites] Non-JSON response');
    }
    
    console.log('[api/point/favorites] Backend response status:', backendResponse.status);
    console.log('[api/point/favorites] Backend data:', backendData);

    // Если токен истек - пытаемся обновить
    if (backendResponse.status === 401) {
      const isTokenError = backendData.code === "token_not_valid" || 
                          backendData.detail?.includes("token") ||
                          responseText.includes("token");
      
      if (isTokenError) {
        console.log('[api/point/favorites] Token expired, trying to refresh...');
        
        // Получаем refresh токен из куки
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;
        
        if (refreshToken) {
          // Обновляем токен
          const newTokens = await refreshAuthToken(refreshToken);
          
          if (newTokens && newTokens.access) {
            console.log('[api/point/favorites] Token refreshed successfully');
            
            // Обновляем заголовок с новым токеном
            authHeader = `Bearer ${newTokens.access}`;
            
            // ПОВТОРНАЯ ПОПЫТКА - с новым токеном
            backendResponse = await fetch(url, {
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
            });
            
            // Повторно парсим ответ
            const retryText = await backendResponse.text();
            let retryData: any = {};
            
            try {
              if (retryText) {
                retryData = JSON.parse(retryText);
              }
            } catch {
              console.log('[api/point/favorites] Non-JSON retry response');
            }
            
            if (!backendResponse.ok) {
              console.error('[api/point/favorites] Retry failed:', retryData);
              return NextResponse.json(
                { 
                  status: 'error', 
                  error: retryData.detail || retryData.error || 'Failed to fetch favorites after refresh'
                }, 
                { status: backendResponse.status }
              );
            }
            
            // УСПЕХ после обновления токена
            return NextResponse.json({ 
              status: 'success',
              data: retryData.data || retryData,
              token_refreshed: true,
              new_access_token: newTokens.access // Отправляем новый токен фронтенду
            });
          }
        }
        
        // Не удалось обновить токен
        console.log('[api/point/favorites] Token refresh failed or no refresh token');
        return NextResponse.json(
          { 
            status: 'error',
            error: 'Token expired and cannot be refreshed',
            code: 'token_not_valid',
            details: 'Please login again'
          }, 
          { status: 401 }
        );
      }
      
      // Другие 401 ошибки
      return NextResponse.json(
        { 
          status: 'error', 
          error: backendData.detail || backendData.error || 'Unauthorized',
          code: backendData.code
        }, 
        { status: 401 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: backendData.detail || backendData.error || 'Failed to fetch favorites'
        }, 
        { status: backendResponse.status }
      );
    }

    console.log('[api/point/favorites] Success, favorites count:', backendData.data?.length || backendData.length || 0);
    
    return NextResponse.json({ 
      status: 'success',
      data: backendData.data || backendData 
    });

  } catch (error) {
    console.error('[api/point/favorites] Unhandled error:', error);
    
    if (error instanceof Error && 
        (error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.message.includes('ECONNREFUSED'))) {
      
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Cannot connect to backend',
          details: error.message
        },
        { status: 502 }
      );
    }
    
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';