import { NextResponse } from 'next/server';
import Locality from '@/lib/models/Locality';
import { protect } from '@/lib/middleware/auth';

const pickLocalityFields = (body) => {
  const allowedFields = ['name', 'city', 'description'];

  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const locality = await Locality.getById(id);
    if (!locality) {
      return NextResponse.json({ success: false, error: 'Locality not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: locality });
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
    const locality = await Locality.update(id, pickLocalityFields(body));
    if (!locality) {
      return NextResponse.json({ success: false, error: 'Locality not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: locality });
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
    await Locality.delete(id);
    return NextResponse.json({ success: true, message: 'Locality deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
