import { NextResponse } from 'next/server';
import cityModel from '@/lib/models/City';
import { protect } from '@/lib/middleware/auth';

export async function GET() {
  try {
    const cities = await cityModel.getNames();
    return NextResponse.json(
      { success: true, data: cities },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    }

    const { name, state } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'City name is required' }, { status: 400 });
    }

    const city = await cityModel.upsert(name, state);
    return NextResponse.json({ success: true, data: city }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'City ID is required' }, { status: 400 });
    }

    await cityModel.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
