import client from '@/api/client';

const BASE_URL = '';

export function checkUser(account: string, signature: string, ruleId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payload = {
        type: 'telegram',
        href: 'https://t.me/TezosUkraine',
      };
      resolve(payload);
      //   reject({ message: 'Insufficient funds' });
    }, 2000);
  });
  //   return client.post(`${BASE_URL}/check`, { account, signature });
}

export function fetchRuleById(ruleId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payload = {
        type: 'telegram',
        title: 'Tezos Ukraine - Secret telegram',
        token: 'TEZ',
        balance: 100,
      };
      resolve(payload);
      //   reject({ message: 'Insufficient funds' });
    }, 2000);
  });
}
