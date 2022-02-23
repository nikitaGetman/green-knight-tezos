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
