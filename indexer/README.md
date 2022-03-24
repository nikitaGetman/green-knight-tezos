# Green Knight blockchain indexer

The indexer collects information about tokens in the blockchain, and monitors transactions of authorized wallets to determine their balance. After the wallet balance drops below the required level, access to the resource for this user will be disabled.

This module uses [Dappetizer](https://dappetizer.dev) framework for working with Tezos.

> Note: In the prototype version, the indexing module has been replaced with the TzKT API.
