export function hasMessage(value: unknown): value is { description: string } {
  return typeof value === 'object' && value !== null && 'description' in value;
}

export function formatIpfsUrl(url: string) {
  return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
}
