import { NextResponse } from 'next/server';
import LocationPage from '@/lib/models/LocationPage';
import { protect } from '@/lib/middleware/auth';

export async function GET() {
  try {
    const pages = await LocationPage.getAll();
    return NextResponse.json({ success: true, data: pages });
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
    const body = await request.json();
    const { city, slug } = body;
    if (!city || !slug) {
      return NextResponse.json({ success: false, error: 'City and slug are required' }, { status: 400 });
    }
    const page = await LocationPage.create(body);
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
