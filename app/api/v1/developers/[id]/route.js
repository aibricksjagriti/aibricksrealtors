import { NextResponse } from 'next/server';
import Developer from '@/lib/models/Developer';
import { protect } from '@/lib/middleware/auth';

const pickDeveloperFields = (body) => {
  const allowedFields = [
    'name',
    'slug',
    'logo',
    'banner',
    'tagline',
    'description',
    'about',
    'impactPoints',
  ];

  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    // Support lookup by slug too
    let developer = await Developer.getById(id);
    if (!developer) {
      developer = await Developer.getBySlug(id);
    }
    if (!developer) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    }

    const { id } = await params;
    const body = await request.json();
    const developer = await Developer.update(id, pickDeveloperFields(body));
    if (!developer) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, { status: authResult.error.statusCode });
    }

    const { id } = await params;
    await Developer.delete(id);
    return NextResponse.json({ success: true, message: 'Developer deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
