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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const citiesOnly = searchParams.get('citiesOnly');

    if (citiesOnly === 'true') {
      const cities = await Locality.getCities();
      return NextResponse.json({ success: true, data: cities });
    }

    const filters = {};
    if (city) filters.city = city;
    if (state) filters.state = state;

    const localities = await Locality.getAll(filters);
    return NextResponse.json({ success: true, data: localities });
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
    const localityData = pickLocalityFields(body);
    const { name, city } = localityData;

    if (!name || !city) {
      return NextResponse.json({ success: false, error: 'Name and city are required' }, { status: 400 });
    }

    const locality = await Locality.create(localityData);
    return NextResponse.json({ success: true, data: locality }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
