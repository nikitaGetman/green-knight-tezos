const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const MOCK_DATA = require('./data/mocks.json');

router.get('/tokens', (req, res) => {
  const { q } = req.query;

  const isContractAddress = q.startsWith('KT') && q.length === 36;

  const requests = isContractAddress
    ? [axios.get('https://api.mainnet.tzkt.io/v1/tokens', { params: { contract: q, tokenId: 0 } })]
    : [
        axios.get('https://api.mainnet.tzkt.io/v1/tokens', {
          params: { 'metadata.symbol.as': `${q}*`, tokenId: 0, limit: 20 },
        }),
        axios.get('https://api.mainnet.tzkt.io/v1/tokens', {
          params: { 'metadata.name.as': `${q}*`, tokenId: 0, limit: 20 },
        }),
      ];

  axios
    .all(requests)
    .then(
      axios.spread((...responses) => {
        const list = isContractAddress ? responses[0].data : [...responses[0].data, ...responses[1].data];
        const filteredList = list.reduce((acc, item) => {
          if (acc.find((i) => i.id === item.id)) {
            return acc;
          }
          return [...acc, item];
        }, []);

        const response = {
          list: filteredList,
        };

        res.send(response);
      })
    )
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

router.get('/token', (req, res) => {
  const { contract } = req.query;

  axios.get('https://api.mainnet.tzkt.io/v1/tokens', { params: { contract } }).then((result) => {
    const token = result.data;
    res.send(token);
  });
});

router.get('/link', (req, res) => {
  const { link } = req.query;
  const linkData = MOCK_DATA.links[link] || {};

  res.send(linkData);
});

router.post('/link', (req, res) => {
  // tezosRpc , tezos
  const { token, type, href, minBalance, title } = req.body;

  const id = crypto.randomBytes(8).toString('hex');

  const tokenData = { name: 'TEZ', icon: '' };
  const response = {
    id,
    token: tokenData,
    type,
    minBalance,
    title,
  };

  MOCK_DATA.links[id] = { ...response, href };

  res.send(response);
});

router.post('/link/check', (req, res) => {
  const { account, signature, link } = req.body;

  // TODO validate signature and account hashes

  const data = { status: 'ok', type: 'link', href: MOCK_DATA.links[link].href };
  // const data = { status: 'error', message: 'Insufficient funds in the account' };

  setTimeout(() => {
    res.send(data);
  }, 2000);
});

module.exports = router;
