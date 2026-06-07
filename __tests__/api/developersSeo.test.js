// Tests that the developers API accepts and persists SEO fields
// and still filters out unknown fields.

jest.mock('@/lib/models/Developer', () => ({
  create: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getBySlug: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/lib/middleware/auth', () => ({
  protect: jest.fn().mockResolvedValue({ user: { id: 'admin' } }),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init) => ({ data, init }),
  },
}));

const Developer = require('@/lib/models/Developer');
const { POST } = require('@/app/api/v1/developers/route');
const { PUT } = require('@/app/api/v1/developers/[id]/route');

const makeRequest = (body) => ({ json: async () => body });

describe('developers API — SEO fields', () => {
  beforeEach(() => jest.clearAllMocks());

  test('POST passes SEO fields through to Developer.create', async () => {
    Developer.create.mockResolvedValue({ id: 'd1' });

    await POST(
      makeRequest({
        name: 'Godrej',
        slug: 'godrej',
        metaTitle: 'Godrej Projects in Pune',
        metaDescription: 'Buy Godrej flats in Pune',
        metaKeywords: 'godrej, pune flats',
        canonicalUrl: 'https://godrej.aibricksrealtors.com',
        maliciousField: 'hack',
      })
    );

    expect(Developer.create).toHaveBeenCalledTimes(1);
    const saved = Developer.create.mock.calls[0][0];
    expect(saved.metaTitle).toBe('Godrej Projects in Pune');
    expect(saved.metaDescription).toBe('Buy Godrej flats in Pune');
    expect(saved.metaKeywords).toBe('godrej, pune flats');
    expect(saved.canonicalUrl).toBe('https://godrej.aibricksrealtors.com');
    expect(saved.maliciousField).toBeUndefined();
  });

  test('PUT passes SEO fields through to Developer.update', async () => {
    Developer.update.mockResolvedValue({ id: 'd1' });

    await PUT(
      makeRequest({
        metaTitle: 'Updated Title',
        metaDescription: 'Updated Description',
        metaKeywords: 'a, b',
        canonicalUrl: '',
        unknownField: 'nope',
      }),
      { params: Promise.resolve({ id: 'd1' }) }
    );

    expect(Developer.update).toHaveBeenCalledTimes(1);
    const [id, saved] = Developer.update.mock.calls[0];
    expect(id).toBe('d1');
    expect(saved.metaTitle).toBe('Updated Title');
    expect(saved.metaDescription).toBe('Updated Description');
    expect(saved.metaKeywords).toBe('a, b');
    // empty string is allowed (clears the field)
    expect(saved.canonicalUrl).toBe('');
    expect(saved.unknownField).toBeUndefined();
  });

  test('POST still requires name and slug', async () => {
    const res = await POST(makeRequest({ metaTitle: 'No name' }));
    expect(res.data.success).toBe(false);
    expect(Developer.create).not.toHaveBeenCalled();
  });

  test('existing content fields still pass through (regression)', async () => {
    Developer.create.mockResolvedValue({ id: 'd2' });
    await POST(
      makeRequest({
        name: 'Lodha',
        slug: 'lodha',
        logo: '/l.png',
        banner: '/b.jpg',
        tagline: 'Lodha Projects',
        description: 'desc',
        about: 'about',
        impactPoints: [{ title: 't', desc: 'd' }],
      })
    );
    const saved = Developer.create.mock.calls[0][0];
    expect(saved).toMatchObject({
      name: 'Lodha',
      slug: 'lodha',
      logo: '/l.png',
      banner: '/b.jpg',
      tagline: 'Lodha Projects',
      description: 'desc',
      about: 'about',
    });
  });
});
