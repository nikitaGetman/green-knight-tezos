# Green Knight Protect for Tezos Blockchain

_Authored by Nikita Getman for Tezos DeFi Hackathon 2022_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Logo](./docs/logo.png)

Green Knight is a token-gated access service built on the Tezos blockchain. It verifies whether a connected wallet holds a sufficient balance of specific FA1.2 or FA2 tokens and grants access to protected resources such as Telegram or Discord channels, or HTTP endpoints.

To gain access, users simply connect their wallet and sign a message to prove ownership. If their token balance meets the defined threshold, access is granted automatically.

You can use Green Knight as a SaaS solution, integrate it via open [open API](./backend/), or embed it directly in your product using the [Green Knight Plugin](./plugin/).

## 🔐 Key Features:

1. **Token-gated access control.** Restrict access to web resources, Telegram or Discord communities based on users’ FA1.2 / FA2 token balances.
2. **Per-token resource management.** Configure unique resources for each tokenId of FA2 tokens — ideal for NFT-gated content or memberships.
3. **Community moderation bots.** Telegram and Discord bots automatically manage group membership based on token holdings. Add or remove users as their balance changes.
4. **Seamless web integration.** The Green Knight plugin allows your web app to verify if a connected wallet holds enough tokens before unlocking specific content or features.
5. **Open API for developers.** Third-party apps in the Tezos ecosystem can use the API to check token balances and implement custom logic.

## Architecture

The application consists of several modules:

- [Web app](./frontend/)
- [Blockchain indexer](./indexer/)
- [API](./backend/)
- [Telegram Bot](./bots/)
- [Discord Bot](./bots/)
- [Plugin CDN](./plugin/)

> _Note: in prototype version the indexer is implemented on TzKT API. Bots for messengers are not implemented in the prototype._

### App scheme

![App scheme](./docs/architecture.png)

## Roadmap

Q1 2022:

- Green Knight prototype launch

Q2 2022:

- Grow the development team
- Implementation of a local blockchain indexer
- Launching a Telegram bot
- Public alpha-version release

Q3 2022:

- New Supported Tezos Wallets
- Launching a Discord bot
- Integration with various ecosystem projects

Q4 2022:

- Launching a referral program
- Launching of the monetization model

Q1 2023:

- ...

## Deployment

Docker-compose is used to simplify working with containers. In the future, k8s will be used instead.

```
docker-compose up
```

## Have a question?

Feel free to contact me via:

- Telegram: https://t.me/nikita_getman
- Email: nikita.getman56@gmail.com

Cheers! 🍺

[RUS version of this file](./README_ru.md)
[Demo](http://84.201.184.103/)
