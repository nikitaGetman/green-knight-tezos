const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const MOCK_DATA = require('./data/mocks.json');

router.get('/token', (req, res) => {
  const { q } = req.query;

  // TODO search token by q

  res.send('Hello world');
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
