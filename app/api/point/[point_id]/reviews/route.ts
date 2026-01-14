import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ point_id: string }> }
) {
  try {
    const params = await context.params;
    const pointId = params.point_id;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '20';

    console.log('[api/point/reviews] Fetching reviews for point:', pointId);
    console.log('[api/point/reviews] Page:', page, 'Page size:', pageSize);
    console.log('[api/point/reviews] Using backend URL:', API_BASE_URL);
    
    const url = `${API_BASE_URL}/point/${pointId}/reviews/?page=${page}&page_size=${pageSize}`;
    console.log('[api/point/reviews] Full URL:', url);
    
    const backendResponse = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('[api/point/reviews] Response status:', backendResponse.status);

    if (!backendResponse.ok) {
      let errorText = '';
      try {
        errorText = await backendResponse.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      
      console.error('[api/point/reviews] Backend error:', errorText);
      
      return NextResponse.json(
        { 
          status: 'error', 
          error: `Failed to fetch reviews: ${backendResponse.status}`,
          details: errorText.length > 500 ? errorText.substring(0, 500) + '...' : errorText
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('[api/point/reviews] Success, reviews count:', data.reviews?.length || 0);
    
    return NextResponse.json({ 
      status: 'success', 
      data: data.data || data 
    });

  } catch (error) {
    console.error('[api/point/reviews] Unhandled error:', error);
    
    if (error instanceof Error && 
        (error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.message.includes('ECONNREFUSED'))) {
      
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Cannot connect to backend',
          details: error.message,
          suggestion: `Make sure backend is running at ${API_BASE_URL}`
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