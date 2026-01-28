export function configToOptions<
  T extends Record<string, { value: string; label: string }>
>(config: T) {
  return Object.values(config);
}
