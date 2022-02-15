// import { Network as BeaconNetwork, NetworkType as BeaconNetworkType, DAppClient } from '@airgap/beacon-sdk';
// import { BeaconWallet } from '@taquito/beacon-wallet';
// import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';
// import { inherits } from 'util';

// import { ReadOnlySigner } from './read-only-signer';

// export type NetworkType = BeaconNetworkType.MAINNET | BeaconNetworkType.HANGZHOUNET;

// const networksTokensData = {
//   [BeaconNetworkType.MAINNET]: {
//     address: 'KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng',
//     id: 0,
//     decimals: 8,
//     name: 'CRUNCH',
//   },
//   [BeaconNetworkType.HANGZHOUNET]: {
//     address: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ',
//     id: 0,
//     decimals: 6,
//     name: 'Test QUIPU',
//   },
// };

// interface ActiveBeaconNetwork extends BeaconNetwork {
//   type: NetworkType;
// }

// export const defaultRpcUrls = {
//   [BeaconNetworkType.MAINNET]: 'https://mainnet.api.tez.ie',
//   [BeaconNetworkType.HANGZHOUNET]: 'https://hangzhounet.api.tez.ie',
// };

// export interface DAppConnection {
//   pkh: string;
//   pk: string;
//   tezos: TezosToolkit;
// }

// export class WalletNotConnectedError extends Error {
//   constructor() {
//     super('Wallet was not connected');
//   }
// }

// const michelEncoder = new MichelCodecPacker();

// const dAppClient = new DAppClient({
//   name: 'Test app',
//   iconUrl: `${process.env.REACT_APP_BASE_URL}/favicon.ico`,
//   preferredNetwork: BeaconNetworkType.HANGZHOUNET,
// });

// export const getActiveAccount = () => {
//   return dAppClient.getActiveAccount().then((account) => {
//     console.log(account);
//     return account;
//   });
// };

// export const connectWalletBeacon = async (
//   forcePermission: boolean,
//   network: ActiveBeaconNetwork
// ): Promise<DAppConnection> => {
//   // beaconWallet.client.preferredNetwork = network.type;
//   // const activeAccount = await beaconWallet.client.getActiveAccount();
//   // if (forcePermission || !activeAccount) {
//   //   if (activeAccount) {
//   //     await beaconWallet.clearActiveAccount();
//   //   }
//   //   await beaconWallet.requestPermissions({ network });
//   // }

//   try {
//     const permissions = await dAppClient.requestPermissions();
//     console.log('Got permissions:', permissions);
//   } catch (error) {
//     console.log('Got error:', error);
//   }

//   console.log('create tezos');
//   const tezos = new TezosToolkit(network.rpcUrl ?? defaultRpcUrls[network.type]);
//   tezos.setPackerProvider(michelEncoder);
//   // tezos.setWalletProvider(dAppClient);
//   const activeAcc = await dAppClient.getActiveAccount();
//   if (!activeAcc) {
//     throw new Error('Wallet wasn`t connected');
//   }

//   tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));

//   console.log(activeAcc);
//   return { pkh: activeAcc.address, pk: activeAcc.publicKey, tezos };
// };

import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { AccountInfo, NetworkType } from '@airgap/beacon-sdk';

export class WalletController {
  // private tezos;
  private network: NetworkType;
  private wallet: BeaconWallet;
  private account: AccountInfo | undefined;

  constructor(network = NetworkType.HANGZHOUNET) {
    this.network = network;

    const options = {
      name: 'Test app',
      iconUrl: `${process.env.REACT_APP_BASE_URL}/favicon.ico`,
      preferredNetwork: this.network,
    };

    this.wallet = new BeaconWallet(options);

    // this.tezos = new TezosToolkit(accountSettings.provider);
  }

  loadActiveAccount() {
    return this.wallet.client.getActiveAccount().then((account) => {
      this.account = account;
      console.log(account);
      return account;
    });
  }

  clearActiveAccount() {
    return this.wallet.client.clearActiveAccount().then(() => {
      this.account = undefined;
    });
  }

  getAccount() {
    return this.account;
  }

  async connectWallet(forcePermission = false, network = this.network) {
    const options = {
      network: {
        type: network,
      },
    };

    const activeAccount = await this.loadActiveAccount();

    if (activeAccount) {
      if (!forcePermission) {
        return activeAccount;
      }

      await this.clearActiveAccount();
    }

    const permissions = await this.wallet.client.requestPermissions(options);
    this.account = permissions.accountInfo;

    return this.account;
  }
}

export default new WalletController();
