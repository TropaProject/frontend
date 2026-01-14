import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ point_id: string }> }
) {
  try {
    const params = await context.params;
    const pointId = params.point_id;
    
    console.log('[api/point/detail] Point ID:', pointId);
    console.log('[api/point/detail] API_BASE_URL:', API_BASE_URL);
    
    const backendResponse = await fetch(
      `${API_BASE_URL}/point/${pointId}/detail/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    console.log('Backend response status:', backendResponse.status);

    // Если бэкенд вернул 404
    if (backendResponse.status === 404) {
      return NextResponse.json(
        { error: 'Point not found' },
        { status: 404 }
      );
    }

    // Если другая ошибка бэкенда
    if (!backendResponse.ok) {
      let errorData;
      try {
        errorData = await backendResponse.json();
      } catch {
        errorData = { detail: 'Failed to fetch point details' };
      }
      return NextResponse.json(
        { 
          status: 'error',
          error: errorData.detail || `HTTP ${backendResponse.status}` 
        },
        { status: backendResponse.status }
      );
    }

    let data;
    try {
      data = await backendResponse.json();
    } catch (error) {
      console.error('JSON parse error:', error);
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Invalid response format from backend' 
        },
        { status: 500 }
      );
    }

    // Возвращаем данные в формате вашего API
    return NextResponse.json({ 
      status: 'success', 
      data: data.data || data 
    });

  } catch (error) {
    console.error('Point detail API route error:', error);
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

// Добавьте для динамических маршрутов
export const dynamic = 'force-dynamic';