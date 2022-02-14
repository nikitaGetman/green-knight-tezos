export function hasMessage(value: unknown): value is { description: string } {
  return typeof value === 'object' && value !== null && 'description' in value;
}
