const { Client } = require("pg");

const DB_HOST = process.env.DB_HOST || "localhost:5432";
const DB_USER = process.env.DB_USER || "admin";
const DB_NAME = process.env.DB_NAME || "app_db";
const DB_PASSWORD = process.env.DB_PASSWORD || "admin";

const config = {
  connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  statement_timeout: 3000,
  query_timeout: 3000,
  connectionTimeoutMillis: 3000,
};

const client = new Client(config);

const getSecureAccess = async (code) => {
  const query = `
        SELECT sa.title, sa.code, sa.token_id as foreign_token_id, l.type, l.token_id, l.min_balance, l.link 
        FROM public.secure_access sa
        INNER JOIN public.sa_to_link_map sa_l
        ON sa.id = sa_l.sa_id
        INNER JOIN public.links l
        ON l.id = sa_l.link_id
        WHERE sa.code = $1`;
  const params = [code];
  return client.query(query, params);
};

const createSecureAccess = async ({ title, code, tokenId, links }) => {
  const querySa =
    "INSERT INTO public.secure_access(token_id, code, title) VALUES($1, $2, $3) RETURNING id";
  const paramsSa = [tokenId, code, title];
  const saRequest = await client.query(querySa, paramsSa);
  const secureAccessId = saRequest.rows[0].id;

  const linkValues =
    "VALUES " +
    links
      .map(
        ({ type, tokenId, minBalance, link }) =>
          `('${type}', ${tokenId}, ${minBalance}, '${link}')`
      )
      .join(", ");
  const queryLink = `INSERT INTO public.links(type, token_id, min_balance, link) ${linkValues} RETURNING id`;
  const linksRequest = await client.query(queryLink);

  const linkIds = linksRequest.rows.map((row) => row.id);

  const saLinkValues =
    "VALUES " + linkIds.map((id) => `(${secureAccessId}, ${id})`).join(", ");
  const querySaLink = `INSERT INTO public.sa_to_link_map(sa_id, link_id) ${saLinkValues}`;
  await client.query(querySaLink);

  const response = {
    title,
    code,
    links,
  };

  return response;
};

module.exports = { getSecureAccess, createSecureAccess, client };
