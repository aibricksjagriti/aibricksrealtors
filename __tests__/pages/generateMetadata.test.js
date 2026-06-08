// Tests that public pages build correct SEO metadata from
// admin-managed fields, with sensible fallbacks.

// ── Mock data models (no Firestore in tests) ───────────────────────────────
jest.mock('@/lib/models/Developer', () => ({
  getBySlug: jest.fn(),
}));
jest.mock('@/lib/models/LocationPage', () => ({
  getBySlug: jest.fn(),
}));
jest.mock('@/lib/models/Locality', () => ({
  getAll: jest.fn().mockResolvedValue([]),
}));
jest.mock('@/lib/models/Property', () => ({
  getById: jest.fn(),
}));
jest.mock('@/lib/data/properties', () => ({
  getCachedProperties: jest.fn().mockResolvedValue([]),
}));

// ── Mock UI component trees (not under test) ───────────────────────────────
jest.mock('@/src/Developers/AboutDeveloper', () => () => null);
jest.mock('@/src/Developers/DeveloperHero', () => () => null);
jest.mock('@/src/Developers/DeveloperImpact', () => () => null);
jest.mock('@/src/Developers/ProjectGrid', () => () => null);
jest.mock('@/src/Developers/StickySectionNav', () => () => null);
jest.mock('@/src/FAQSection', () => () => null);
jest.mock('@/src/Home/Navbar', () => () => null);
jest.mock('@/src/Locations/LocationDetailClient', () => () => null);
jest.mock('@/src/Properties/PropertyDetailPageClient', () => () => null);

const Developer = require('@/lib/models/Developer');
const LocationPage = require('@/lib/models/LocationPage');
const propertyModel = require('@/lib/models/Property');
const { getCachedProperties } = require('@/lib/data/properties');
const { SITE_URL } = require('@/lib/utils/seo');

const { generateMetadata: developerMetadata } = require('@/app/developers/[slug]/page.jsx');
const { generateMetadata: subMetadata } = require('@/app/sub/[slug]/page.jsx');
const { generateMetadata: propertyMetadata } = require('@/app/properties/[id]/page.jsx');

const params = (obj) => ({ params: Promise.resolve(obj) });

describe('/developers/[slug] metadata', () => {
  beforeEach(() => jest.clearAllMocks());

  test('uses admin SEO fields when present', async () => {
    Developer.getBySlug.mockResolvedValue({
      name: 'Godrej',
      metaTitle: 'Godrej Flats in Pune | Custom',
      metaDescription: 'Custom description from admin',
      metaKeywords: 'godrej, pune',
      canonicalUrl: 'https://godrej.aibricksrealtors.com',
    });

    const meta = await developerMetadata(params({ slug: 'godrej' }));
    expect(meta.title).toBe('Godrej Flats in Pune | Custom');
    expect(meta.description).toBe('Custom description from admin');
    expect(meta.keywords).toEqual(['godrej', 'pune']);
    expect(meta.alternates.canonical).toBe('https://godrej.aibricksrealtors.com');
    expect(meta.robots.index).toBe(true);
  });

  test('falls back to name/description and default canonical', async () => {
    Developer.getBySlug.mockResolvedValue({
      name: 'Lodha',
      description: 'Lodha is a top builder',
    });

    const meta = await developerMetadata(params({ slug: 'lodha' }));
    expect(meta.title).toBe('Lodha Projects | AI Bricks Realtors');
    expect(meta.description).toBe('Lodha is a top builder');
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/developers/lodha`);
  });

  test('returns 404 for unknown slugs with no matching properties (no soft-404)', async () => {
    Developer.getBySlug.mockResolvedValue(null);
    getCachedProperties.mockResolvedValue([]);
    await expect(
      developerMetadata(params({ slug: 'random-gibberish-xyz' }))
    ).rejects.toThrow(); // notFound() throws → real HTTP 404
  });

  test('unregistered slug with matching properties stays up, builds metadata from name', async () => {
    Developer.getBySlug.mockResolvedValue(null);
    getCachedProperties.mockResolvedValue([{ builderName: 'Godrej Properties' }]);
    const meta = await developerMetadata(params({ slug: 'godrej-properties' }));
    expect(meta.title).toContain('Godrej Properties');
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/developers/godrej-properties`);
  });

  test('alias slug canonicalizes to the proper builder slug', async () => {
    Developer.getBySlug.mockResolvedValue(null);
    getCachedProperties.mockResolvedValue([{ builderName: 'Godrej ' }]);
    // /developers/godrej-new fuzzy-matches "Godrej" properties → canonical points to /developers/godrej
    const meta = await developerMetadata(params({ slug: 'godrej-new' }));
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/developers/godrej`);
  });
});

describe('/sub/[slug] (subdomain) metadata', () => {
  beforeEach(() => jest.clearAllMocks());

  test('developer SEO fields win and canonical defaults to subdomain', async () => {
    Developer.getBySlug.mockResolvedValue({
      name: 'Godrej',
      metaTitle: 'Godrej Pune | Admin Title',
      metaDescription: 'Admin description',
    });

    const meta = await subMetadata(params({ slug: 'godrej' }));
    expect(meta.title).toBe('Godrej Pune | Admin Title');
    expect(meta.alternates.canonical).toBe('https://godrej.aibricksrealtors.com');
  });

  test('falls back to location page SEO fields', async () => {
    Developer.getBySlug.mockResolvedValue(null);
    LocationPage.getBySlug.mockResolvedValue({
      city: 'Pune',
      metaTitle: 'Pune Properties | Admin',
      metaDescription: 'Pune admin description',
      canonicalUrl: 'https://aibricksrealtors.com/locations/pune',
    });

    const meta = await subMetadata(params({ slug: 'pune' }));
    expect(meta.title).toBe('Pune Properties | Admin');
    expect(meta.alternates.canonical).toBe('https://aibricksrealtors.com/locations/pune');
  });

  test('returns safe defaults when nothing is registered', async () => {
    Developer.getBySlug.mockResolvedValue(null);
    LocationPage.getBySlug.mockResolvedValue(null);
    const meta = await subMetadata(params({ slug: 'unknown' }));
    expect(meta.alternates.canonical).toBe('https://unknown.aibricksrealtors.com');
  });
});

describe('/properties/[id] metadata', () => {
  beforeEach(() => jest.clearAllMocks());

  test('uses admin SEO fields when present', async () => {
    propertyModel.getById.mockResolvedValue({
      propertyTitle: 'Skyline Towers',
      metaTitle: 'Skyline Towers 2BHK | Admin',
      metaDescription: 'Admin property description',
      metaKeywords: '2bhk, pune',
      canonicalUrl: 'https://aibricksrealtors.com/properties/custom',
      mainPropertyImage: 'https://cdn.x/main.jpg',
    });

    const meta = await propertyMetadata(params({ id: 'abc123' }));
    expect(meta.title).toBe('Skyline Towers 2BHK | Admin');
    expect(meta.description).toBe('Admin property description');
    expect(meta.keywords).toEqual(['2bhk', 'pune']);
    expect(meta.alternates.canonical).toBe('https://aibricksrealtors.com/properties/custom');
    expect(meta.openGraph.images[0].url).toBe('https://cdn.x/main.jpg');
  });

  test('falls back to title, truncated description and default canonical', async () => {
    propertyModel.getById.mockResolvedValue({
      propertyTitle: 'Green Villa',
      locality: 'Baner',
      city: 'Pune',
      description: 'x'.repeat(500),
    });

    const meta = await propertyMetadata(params({ id: 'abc123' }));
    expect(meta.title).toBe('Green Villa in Baner, Pune | AI Bricks Realtors');
    expect(meta.description.length).toBeLessThanOrEqual(160);
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/properties/abc123`);
  });

  test('does not crash when property is missing', async () => {
    propertyModel.getById.mockResolvedValue(null);
    const meta = await propertyMetadata(params({ id: 'missing' }));
    expect(meta.title).toBe('Property | AI Bricks Realtors');
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/properties/missing`);
  });

  test('does not crash when the model throws', async () => {
    propertyModel.getById.mockRejectedValue(new Error('firestore down'));
    const meta = await propertyMetadata(params({ id: 'err' }));
    expect(meta.title).toBe('Property | AI Bricks Realtors');
  });
});
