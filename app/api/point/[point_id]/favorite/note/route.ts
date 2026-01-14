import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ point_id: string }> }
) {
  try {
    const params = await context.params;
    const pointId = params.point_id;
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ status: 'error', error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[api/point/favorite/note] Updating note for point:', pointId);
    const url = `${API_BASE_URL}/point/${pointId}/favorite/note/`;
    
    const backendResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await backendResponse.text();
    let backendData: any = {};
    
    try {
      if (responseText) {
        backendData = JSON.parse(responseText);
      }
    } catch {
      console.log('[api/point/favorite/note] Non-JSON response');
    }

    // Если токен истек
    if (backendResponse.status === 401 && 
        (backendData.code === "token_not_valid" || backendData.detail?.includes("token"))) {
      console.log('[api/point/favorite/note] Token expired');
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Token expired',
          code: 'token_not_valid',
          details: backendData.detail
        }, 
        { status: 401 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: backendData.detail || backendData.error || 'Failed to update note'
        }, 
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ 
      status: 'success',
      note: backendData.note 
    });

  } catch (error) {
    console.error('[api/point/favorite/note] Unhandled error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';