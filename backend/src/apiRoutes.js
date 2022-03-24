const express = require("express");
const {
  searchTokens,
  getTokenById,
  getSecureLinkByCode,
  createSecureLink,
  checkUserHasAccess,
} = require("./service");

const router = express.Router();

router.get("/tokens", async (req, res) => {
  const { q } = req.query;

  try {
    const tokens = await searchTokens(q);
    const response = { list: tokens };
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

router.get("/token", async (req, res) => {
  const { id } = req.query;

  try {
    const token = await getTokenById(id);
    if (!token) {
      res.status(404).send("Token not found");
    } else {
      res.send(token);
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

router.get("/link", async (req, res) => {
  try {
    const { link: code } = req.query;

    const secureLink = await getSecureLinkByCode(code);
    if (!secureLink) {
      res.status(404).send("Link not found");
    } else {
      res.send(secureLink);
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

router.post("/link", async (req, res) => {
  try {
    const { title, token, links } = req.body;

    const secureLink = await createSecureLink({ title, token, links });
    res.send(secureLink);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/link/check", async (req, res) => {
  try {
    const { account, signature, link } = req.body;
    const result = await checkUserHasAccess({
      account,
      signature,
      linkCode: link,
    });

    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

module.exports = router;
