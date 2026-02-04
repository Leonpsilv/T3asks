beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.setSystemTime(new Date(0));
});
