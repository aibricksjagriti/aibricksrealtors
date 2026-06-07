// Tests for app/robots.js and app/sitemap.js
jest.mock('@/lib/models/Developer', () => ({
  getAll: jest.fn(),
}));
jest.mock('@/lib/models/LocationPage', () => ({
  getAll: jest.fn(),
}));
jest.mock('@/lib/data/properties', () => ({
  getCachedProperties: jest.fn(),
}));

const Developer = require('@/lib/models/Developer');
const LocationPage = require('@/lib/models/LocationPage');
const { getCachedProperties } = require('@/lib/data/properties');
const robots = require('@/app/robots').default;
const sitemap = require('@/app/sitemap').default;
const { SITE_URL } = require('@/lib/utils/seo');

describe('robots.txt', () => {
  test('allows crawling but blocks admin, dashboard, api and search', () => {
    const result = robots();
    const rule = result.rules[0];
    expect(rule.allow).toBe('/');
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/dashboard', '/api/', '/search']));
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe('sitemap.xml', () => {
  beforeEach(() => jest.clearAllMocks());

  test('includes static routes plus properties, developers, and locations', async () => {
    getCachedProperties.mockResolvedValue([
      { id: 'prop1', updatedAt: '2026-01-01' },
      { id: 'prop2' },
      { noId: true },
    ]);
    Developer.getAll.mockResolvedValue([{ slug: 'godrej' }, { name: 'no-slug' }]);
    LocationPage.getAll.mockResolvedValue([{ slug: 'pune' }]);

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        `${SITE_URL}`,
        `${SITE_URL}/properties`,
        `${SITE_URL}/locations`,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/properties/prop1`,
        `${SITE_URL}/properties/prop2`,
        `${SITE_URL}/developers/godrej`,
        `${SITE_URL}/locations/pune`,
      ])
    );
    // entries without id/slug must be skipped
    expect(urls.filter((u) => u.includes('undefined'))).toHaveLength(0);
    // every entry has a valid lastModified date
    entries.forEach((e) => expect(e.lastModified instanceof Date && !isNaN(e.lastModified)).toBe(true));
  });

  test('still returns static routes when all data sources fail', async () => {
    getCachedProperties.mockRejectedValue(new Error('firestore down'));
    Developer.getAll.mockRejectedValue(new Error('firestore down'));
    LocationPage.getAll.mockRejectedValue(new Error('firestore down'));

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${SITE_URL}`);
    expect(urls).toContain(`${SITE_URL}/properties`);
    expect(entries.length).toBeGreaterThanOrEqual(8);
  });

  test('handles Firestore Timestamp-like objects for lastModified', async () => {
    getCachedProperties.mockResolvedValue([
      { id: 'p1', updatedAt: { toDate: () => new Date('2026-02-02') } },
    ]);
    Developer.getAll.mockResolvedValue([]);
    LocationPage.getAll.mockResolvedValue([]);

    const entries = await sitemap();
    const prop = entries.find((e) => e.url.endsWith('/properties/p1'));
    expect(prop.lastModified.getFullYear()).toBe(2026);
  });
});
