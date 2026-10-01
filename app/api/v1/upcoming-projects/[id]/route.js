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

export async function GET(request, { params }) {
  try {
    const project = await UpcomingProject.getById((await params).id);
    if (!project) return NextResponse.json({ success: false, error: 'Upcoming project not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await protect(request);
    if (auth.error) return NextResponse.json(auth.error, { status: auth.error.statusCode });
    const data = normalize(pickFields(await request.json()));
    const project = await UpcomingProject.update((await params).id, data);
    if (!project) return NextResponse.json({ success: false, error: 'Upcoming project not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await protect(request);
    if (auth.error) return NextResponse.json(auth.error, { status: auth.error.statusCode });
    await UpcomingProject.delete((await params).id);
    return NextResponse.json({ success: true, message: 'Upcoming project deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
