// Tests for lib/utils/seo.js — buildMetadata()
const { buildMetadata, normalizeCanonical, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } = require('@/lib/utils/seo');

describe('buildMetadata', () => {
  test('builds default canonical from path', () => {
    const meta = buildMetadata({ title: 'Test', path: '/about' });
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/about`);
  });

  test('admin canonicalUrl overrides the default path canonical', () => {
    const meta = buildMetadata({
      title: 'Test',
      path: '/developers/godrej',
      canonicalUrl: 'https://godrej.aibricksrealtors.com',
    });
    expect(meta.alternates.canonical).toBe('https://godrej.aibricksrealtors.com');
  });

  test('sets title and description', () => {
    const meta = buildMetadata({ title: 'My Title', description: 'My description' });
    expect(meta.title).toBe('My Title');
    expect(meta.description).toBe('My description');
  });

  test('defaults to index/follow robots', () => {
    const meta = buildMetadata({ title: 'Test' });
    expect(meta.robots.index).toBe(true);
    expect(meta.robots.follow).toBe(true);
    expect(meta.robots.googleBot.index).toBe(true);
  });

  test('noIndex blocks indexing', () => {
    const meta = buildMetadata({ title: 'Test', noIndex: true });
    expect(meta.robots.index).toBe(false);
    expect(meta.robots.follow).toBe(false);
  });

  test('parses comma-separated keywords string into array', () => {
    const meta = buildMetadata({ keywords: 'flats in pune, godrej , 2 bhk,' });
    expect(meta.keywords).toEqual(['flats in pune', 'godrej', '2 bhk']);
  });

  test('passes keyword arrays through unchanged', () => {
    const meta = buildMetadata({ keywords: ['a', 'b'] });
    expect(meta.keywords).toEqual(['a', 'b']);
  });

  test('omits keywords when not provided', () => {
    const meta = buildMetadata({ title: 'Test' });
    expect(meta.keywords).toBeUndefined();
  });

  test('builds Open Graph with canonical url, site name and image', () => {
    const meta = buildMetadata({ title: 'OG Test', path: '/properties', image: 'https://cdn.x/img.jpg' });
    expect(meta.openGraph.title).toBe('OG Test');
    expect(meta.openGraph.url).toBe(`${SITE_URL}/properties`);
    expect(meta.openGraph.siteName).toBe(SITE_NAME);
    expect(meta.openGraph.images[0].url).toBe('https://cdn.x/img.jpg');
  });

  test('falls back to default OG image', () => {
    const meta = buildMetadata({ title: 'Test' });
    expect(meta.openGraph.images[0].url).toBe(DEFAULT_OG_IMAGE);
    expect(meta.twitter.images[0]).toBe(DEFAULT_OG_IMAGE);
  });

  test('builds twitter card', () => {
    const meta = buildMetadata({ title: 'Tw', description: 'D' });
    expect(meta.twitter.card).toBe('summary_large_image');
    expect(meta.twitter.title).toBe('Tw');
  });

  test('handles empty options without crashing', () => {
    const meta = buildMetadata();
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/`);
    expect(meta.title).toBeUndefined();
  });
});

describe('normalizeCanonical (admin-entered canonical values)', () => {
  test('keeps full URLs as-is', () => {
    expect(normalizeCanonical('https://example.com/x', '/developers/godrej')).toBe('https://example.com/x');
  });

  test('prefixes site URL for absolute paths', () => {
    expect(normalizeCanonical('/developers/godrej', '/developers/godrej-new')).toBe(
      `${SITE_URL}/developers/godrej`
    );
  });

  test('resolves bare slugs against the page path', () => {
    // admin typed just "godrej-new" on /developers/godrej
    expect(normalizeCanonical('godrej-new', '/developers/godrej')).toBe(
      `${SITE_URL}/developers/godrej-new`
    );
  });

  test('returns null for empty or whitespace values', () => {
    expect(normalizeCanonical('', '/x')).toBeNull();
    expect(normalizeCanonical('   ', '/x')).toBeNull();
    expect(normalizeCanonical(null, '/x')).toBeNull();
  });

  test('buildMetadata uses normalized bare-slug canonical', () => {
    const meta = buildMetadata({ canonicalUrl: 'godrej-new', path: '/developers/godrej' });
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/developers/godrej-new`);
  });
});
