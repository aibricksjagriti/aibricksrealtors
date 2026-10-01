import { NextResponse } from 'next/server';
import UpcomingProject from '@/lib/models/UpcomingProject';
import { protect } from '@/lib/middleware/auth';

const fields = ['name', 'city', 'image', 'projectLabel', 'launchStatus', 'sortOrder', 'isActive'];
const pickFields = (body) => Object.fromEntries(fields
  .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
  .map((field) => [field, body[field]]));

const normalize = (data) => ({
  ...data,
  ...(typeof data.name === 'string' && { name: data.name.trim() }),
  ...(typeof data.city === 'string' && { city: data.city.trim() }),
  ...(typeof data.image === 'string' && { image: data.image.trim() }),
  ...(typeof data.projectLabel === 'string' && { projectLabel: data.projectLabel.trim() }),
  ...(typeof data.launchStatus === 'string' && { launchStatus: data.launchStatus.trim() }),
  ...(data.sortOrder !== undefined && { sortOrder: Number(data.sortOrder) || 0 }),
});

export async function GET(request) {
  try {
    const activeOnly = new URL(request.url).searchParams.get('activeOnly') === 'true';
    const projects = await UpcomingProject.getAll({ activeOnly });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await protect(request);
    if (auth.error) return NextResponse.json(auth.error, { status: auth.error.statusCode });
    const data = normalize(pickFields(await request.json()));
    if (!data.name?.trim() || !data.city?.trim() || !data.image?.trim()) {
      return NextResponse.json({ success: false, error: 'Name, location and image are required' }, { status: 400 });
    }
    const project = await UpcomingProject.create({
      ...data,
      projectLabel: data.projectLabel?.trim() || 'Upcoming project',
      launchStatus: data.launchStatus?.trim() || 'Ready for launch',
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive !== false,
    });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
