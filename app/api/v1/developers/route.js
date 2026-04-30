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

export async function GET() {
  try {
    const developers = await Developer.getAll();
    return NextResponse.json({ success: true, data: developers });
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
    const developerData = pickDeveloperFields(body);
    const { name, slug } = developerData;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
    }

    const developer = await Developer.create(developerData);
    return NextResponse.json({ success: true, data: developer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
