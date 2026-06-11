import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import LocationPage from '@/lib/models/LocationPage';
import { protect } from '@/lib/middleware/auth';

// Purge the cached (ISR) location page so admin edits — including SEO meta
// fields — reflect immediately instead of after the 300s revalidate window.
const revalidateLocation = (slug) => {
  if (slug) revalidatePath(`/locations/${slug}`);
};

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
    const existing = await LocationPage.getById(id);
    const body = await request.json();
    const page = await LocationPage.update(id, body);
    if (!page) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    revalidateLocation(page.slug || body.slug);
    if (existing?.slug && existing.slug !== page.slug) revalidateLocation(existing.slug);
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
    const existing = await LocationPage.getById(id);
    await LocationPage.delete(id);
    revalidateLocation(existing?.slug);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
