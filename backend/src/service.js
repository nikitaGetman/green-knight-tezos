const dbClient = require("./dbClient");
const axios = require("axios");
const crypto = require("crypto");

const baseUrl =
  process.env.INDEXER_BASE_URL || "https://api.hangzhou2net.tzkt.io/v1";

const searchTokens = (search) => {
  if (!search || typeof search !== "string") {
    return Promise.reject();
  }

  const isContractAddress = search.startsWith("KT") && search.length === 36;
  const requests = isContractAddress
    ? [
        axios.get(`${baseUrl}/tokens`, {
          params: { contract: search },
        }),
      ]
    : [
        axios.get(`${baseUrl}/tokens`, {
          params: { "metadata.symbol.as": `${search}*`, limit: 30 },
        }),
        axios.get(`${baseUrl}/tokens`, {
          params: { "metadata.name.as": `${search}*`, limit: 30 },
        }),
      ];

  return axios.all(requests).then(
    axios.spread((...responses) => {
      const list = isContractAddress
        ? responses[0].data
        : [...responses[0].data, ...responses[1].data];

      const filteredList = list.reduce((acc, item) => {
        if (acc.find((i) => i.contract.address === item.contract.address)) {
          return acc;
        }
        return [...acc, item];
      }, []);

      return filteredList;
    })
  );
};

const getTokenByContract = (contract) => {
  return axios
    .get(`${baseUrl}/tokens`, { params: { contract } })
    .then((result) => {
      return result.data;
    });
};

const getSecureLinkByCode = async (code) => {
  const request = await dbClient.getSecureAccess(code);
  const secureLink = request.rows[0];

  if (!secureLink) {
    return null;
  }

  const { foreign_token_id: externalTokenId } = secureLink;
  const links = request.rows.map(
    ({ type, token_id: tokenId, min_balance: minBalance, link }) => ({
      type,
      tokenId,
      minBalance,
      link,
    })
  );

  return axios
    .get(`${baseUrl}/tokens`, {
      params: { id: externalTokenId },
    })
    .then((result) => {
      const token = result.data[0];

      const response = {
        title: secureLink.title,
        code: secureLink.code,
        links,
        token,
      };

      return response;
    });
};

const createSecureLink = async ({ title, token, links }) => {
  const code = crypto.randomBytes(4).toString("hex");
  const tokenId = token.id;
  const linksData = links.map(({ linkType: type, ...rest }) => ({
    type,
    ...rest,
  }));

  const secureLink = await dbClient.createSecureAccess({
    title,
    code,
    tokenId,
    links: linksData,
  });

  if (!secureLink) {
    throw new Error("Can not create link");
  }

  return secureLink;
};

const checkUserHasAccess = async ({ account, signature, linkCode }) => {
  // TODO validate signature and account hashes

  const secureLink = await getSecureLinkByCode(linkCode);

  const { links } = secureLink;
  const { contract } = secureLink.token;

  return axios
    .get(`${baseUrl}/tokens/balances`, {
      params: { "token.contract": contract.address, account },
    })
    .then(({ data: balances }) => {
      if (!balances.length) {
        return { status: "fail", message: "Insufficient balance" };
      }
      const decimals = parseInt(balances[0].token?.metadata?.decimals || "0");

      const accessLinks = links.filter((link) =>
        balances.find(
          (b) =>
            b.token.tokenId === link.tokenId &&
            parseInt(b.balance) / 10 ** decimals >= parseInt(link.minBalance)
        )
      );

      return { status: "ok", links: accessLinks };
    });
};

module.exports = {
  searchTokens,
  getTokenByContract,
  getSecureLinkByCode,
  createSecureLink,
  checkUserHasAccess,
};
