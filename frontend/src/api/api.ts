import client from '@/api/client';

export function fetchLinkData({ link }: { link: string }): Promise<any> {
  return client.get('/link', { params: { link } });
}

export function checkUser({
  account,
  signature,
  link,
}: {
  account: string;
  signature: string;
  link: string;
}): Promise<any> {
  return client.post('/link/check', { account, signature, link });
}

export function searchTokens({ q }: { q: string }): Promise<any> {
  return client.get('/tokens', { params: { q } });
}

export function searchToken({ contract }: { contract: string }): Promise<any> {
  return client.get('/token', { params: { contract } });
}

export function createSecureLink(params: any): Promise<any> {
  return client.post('/link', params);
}
