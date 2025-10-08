

describe('Environment Setup', () => {
  test('should load environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
  
  test('should have test database configured', () => {
    expect(process.env.TEST_DATABASE_URL).toBeDefined();
  });
});