import { NextResponse } from 'next/server';
import LocationPage from '@/lib/models/LocationPage';
import { protect } from '@/lib/middleware/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let page = await LocationPage.getById(id);
    if (!page) page = await LocationPage.getBySlug(id);
    if (!page) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    const { id } = await params;
    const body = await request.json();
    const page = await LocationPage.update(id, body);
    if (!page) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    const { id } = await params;
    await LocationPage.delete(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
