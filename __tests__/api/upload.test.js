// Tests for the /api/upload route logic
// Mocks Firebase Storage so no real bucket connection is needed.

jest.mock('@/lib/database', () => ({
  getStorage: () => ({
    bucket: (_name) => ({
      file: (_path) => ({
        save: jest.fn().mockResolvedValue(undefined),
        makePublic: jest.fn().mockResolvedValue(undefined),
      }),
      name: 'test-bucket',
    }),
  }),
}));

// Mock NextResponse
const mockJson = jest.fn();
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init) => {
      mockJson(data, init);
      return { data, init };
    },
  },
}));

const { POST } = require('@/app/api/upload/route');

function makeRequest(file, path = 'properties') {
  const formData = new Map();
  formData.get = (key) => {
    if (key === 'file') return file;
    if (key === 'path') return path;
    return null;
  };
  return { formData: () => Promise.resolve(formData) };
}

describe('POST /api/upload', () => {
  beforeEach(() => {
    mockJson.mockClear();
  });

  test('returns 400 when no file is provided', async () => {
    const req = makeRequest(null);
    await POST(req);
    expect(mockJson).toHaveBeenCalledWith(
      { error: 'No file provided' },
      { status: 400 }
    );
  });

  test('returns success with public URL when file is valid', async () => {
    const file = {
      name: 'test image.jpg',
      type: 'image/jpeg',
      arrayBuffer: async () => Buffer.from('fake-image-data'),
    };
    const req = makeRequest(file, 'properties');
    await POST(req);

    const [[result]] = mockJson.mock.calls;
    expect(result.success).toBe(true);
    expect(result.url).toContain('test-bucket');
    expect(result.filename).toContain('test_image.jpg');
  });

  test('sanitizes filename by replacing special characters', async () => {
    const file = {
      name: 'my file & photo (1).png',
      type: 'image/png',
      arrayBuffer: async () => Buffer.from('data'),
    };
    const req = makeRequest(file);
    await POST(req);

    const [[result]] = mockJson.mock.calls;
    // each non-alphanumeric char → single underscore: "my file & photo (1).png" → "my_file___photo__1_.png"
    expect(result.filename).toMatch(/^\d+-my_file___photo__1_\.png$/);
  });
});
