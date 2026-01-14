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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ point_id: string }> }
) {
  try {
    const params = await context.params;
    const pointId = params.point_id;
    
    // Получаем токен из заголовков
    let authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('[api/point/create-review] No authorization header');
      return NextResponse.json(
        { 
          status: 'error', 
          error: 'Unauthorized' 
        }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    console.log('[api/point/create-review] Creating review for point:', pointId);
    
    const url = `${API_BASE_URL}/point/${pointId}/create-review/`;
    console.log('[api/point/create-review] Full URL:', url);
    
    // ПЕРВАЯ ПОПЫТКА - с текущим токеном
    let backendResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Получаем ответ от бэкенда
    const responseText = await backendResponse.text();
    let backendData: any = {};
    
    try {
      if (responseText) {
        backendData = JSON.parse(responseText);
      }
    } catch {
      // Не JSON ответ
      console.log('[api/point/create-review] Non-JSON response:', responseText.substring(0, 200));
    }
    
    console.log('[api/point/create-review] Backend response status:', backendResponse.status);
    console.log('[api/point/create-review] Backend data:', backendData);

    // Если токен истек - пытаемся обновить
    if (backendResponse.status === 401) {
      const isTokenError = backendData.code === "token_not_valid" || 
                          backendData.detail?.includes("token") ||
                          responseText.includes("token");
      
      if (isTokenError) {
        console.log('[api/point/create-review] Token expired, trying to refresh...');
        
        // Получаем refresh токен из куки
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;
        
        if (refreshToken) {
          // Обновляем токен
          const newTokens = await refreshAuthToken(refreshToken);
          
          if (newTokens && newTokens.access) {
            console.log('[api/point/create-review] Token refreshed successfully');
            
            // Обновляем заголовок с новым токеном
            authHeader = `Bearer ${newTokens.access}`;
            
            // ПОВТОРНАЯ ПОПЫТКА - с новым токеном
            backendResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            
            // Повторно парсим ответ
            const retryText = await backendResponse.text();
            let retryData: any = {};
            
            try {
              if (retryText) {
                retryData = JSON.parse(retryText);
              }
            } catch {
              console.log('[api/point/create-review] Non-JSON retry response');
            }
            
            if (!backendResponse.ok) {
              console.error('[api/point/create-review] Retry failed:', retryData);
              return NextResponse.json(
                { 
                  status: 'error', 
                  error: retryData.detail || retryData.error || 'Failed to create review after refresh'
                }, 
                { status: backendResponse.status }
              );
            }
            
            // УСПЕХ после обновления токена
            return NextResponse.json({ 
              status: 'success', 
              data: retryData,
              token_refreshed: true,
              new_access_token: newTokens.access // Отправляем новый токен фронтенду
            });
          }
        }
        
        // Не удалось обновить токен
        console.log('[api/point/create-review] Token refresh failed or no refresh token');
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
      console.error('[api/point/create-review] Backend error:', backendData);
      return NextResponse.json(
        { 
          status: 'error', 
          error: backendData.detail || backendData.error || 'Failed to create review',
          code: backendData.code
        }, 
        { status: backendResponse.status }
      );
    }

    // УСПЕХ с оригинальным токеном
    return NextResponse.json({ 
      status: 'success', 
      data: backendData,
      token_refreshed: false
    });

  } catch (error) {
    console.error('[api/point/create-review] Unhandled error:', error);
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