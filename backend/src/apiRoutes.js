const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const MOCK_DATA = require('./data/mocks.json');

const baseUrl = process.env.INDEXER_BASE_URL || 'https://api.mainnet.tzkt.io/v1/';

router.get('/tokens', (req, res) => {
  const { q } = req.query;

  const isContractAddress = q.startsWith('KT') && q.length === 36;

  const requests = isContractAddress
    ? [axios.get('https://api.mainnet.tzkt.io/v1/tokens', { params: { contract: q } })]
    : [
        axios.get('https://api.mainnet.tzkt.io/v1/tokens', {
          params: { 'metadata.symbol.as': `${q}*`, limit: 30 },
        }),
        axios.get('https://api.mainnet.tzkt.io/v1/tokens', {
          params: { 'metadata.name.as': `${q}*`, limit: 30 },
        }),
      ];

  axios
    .all(requests)
    .then(
      axios.spread((...responses) => {
        const list = isContractAddress ? responses[0].data : [...responses[0].data, ...responses[1].data];
        const filteredList = list.reduce((acc, item) => {
          if (acc.find((i) => i.contract.address === item.contract.address)) {
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
  const linkData = MOCK_DATA.links[link];

  if (!linkData) {
    res.status(404).send('Link not found');
  }

  const filteredLinks = linkData.links.map(({ link, ...rest }) => rest);
  const response = { ...linkData, links: filteredLinks };

  res.send(response);
});

router.post('/link', (req, res) => {
  // tezosRpc , tezos
  const { title, token, links, isSeparateLink = false } = req.body;

  const id = crypto.randomBytes(8).toString('hex');

  const tokenData = { contract: token[0].contract.address, standard: token[0].standard, metadata: token[0].metadata };
  const linksData = links.map(({ linkType, tokenId, minBalance }) => ({ linkType, tokenId, minBalance }));
  const response = {
    id,
    title,
    token: tokenData,
    links: linksData,
  };

  MOCK_DATA.links[id] = { ...response, links, isSeparateLink };

  res.send(response);
});

router.post('/link/check', (req, res) => {
  const { account, signature, link } = req.body;

  // TODO validate signature and account hashes

  const linkData = MOCK_DATA.links[link];

  if (!linkData) {
    res.status(404).send('Incorrect link');
  }

  const { links, isSeparateLink } = linkData;
  const { contract } = linkData.token;

  axios
    .get('https://api.mainnet.tzkt.io/v1/tokens/balances', { params: { 'token.contract': contract, account } })
    .then(({ data: balances }) => {
      if (!balances.length) {
        res.status(403).send('Insufficient balance');
      }
      const decimals = parseInt(balances[0].token?.metadata?.decimals || '0');

      const accessLinks = links.filter((link) =>
        balances.find(
          (b) => b.token.tokenId === link.tokenId && parseInt(b.balance) / 10 ** decimals >= parseInt(link.minBalance)
        )
      );

      res.send({ status: 'ok', links: accessLinks });
    })
    .catch((e) => res.status(500).send(e));
});

module.exports = router;
