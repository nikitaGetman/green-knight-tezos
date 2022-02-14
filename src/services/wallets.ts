import { Network as BeaconNetwork, NetworkType as BeaconNetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';

import { ReadOnlySigner } from './read-only-signer';

export type NetworkType = BeaconNetworkType.MAINNET | BeaconNetworkType.HANGZHOUNET;

const networksTokensData = {
  [BeaconNetworkType.MAINNET]: {
    address: 'KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng',
    id: 0,
    decimals: 8,
    name: 'CRUNCH',
  },
  [BeaconNetworkType.HANGZHOUNET]: {
    address: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ',
    id: 0,
    decimals: 6,
    name: 'Test QUIPU',
  },
};

interface ActiveBeaconNetwork extends BeaconNetwork {
  type: NetworkType;
}

export interface DAppConnection {
  pkh: string;
  pk: string;
  tezos: TezosToolkit;
}

export class WalletNotConnectedError extends Error {
  constructor() {
    super('Wallet was not connected');
  }
}

const michelEncoder = new MichelCodecPacker();
const APP_NAME = 'Test app';

export const beaconWallet = new BeaconWallet({
  name: APP_NAME,
  iconUrl: `${process.env.REACT_APP_BASE_URL}/favicon.ico`,
});

export const defaultRpcUrls = {
  [BeaconNetworkType.MAINNET]: 'https://mainnet.api.tez.ie',
  [BeaconNetworkType.HANGZHOUNET]: 'https://hangzhounet.api.tez.ie',
};

export const connectWalletBeacon = async (
  forcePermission: boolean,
  network: ActiveBeaconNetwork
): Promise<DAppConnection> => {
  beaconWallet.client.preferredNetwork = network.type;
  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      console.log('clearActiveAccount');
      await beaconWallet.clearActiveAccount();
    }
    console.log('requestPermissions');
    await beaconWallet.requestPermissions({ network });
  }

  console.log('create tezos');
  const tezos = new TezosToolkit(network.rpcUrl ?? defaultRpcUrls[network.type]);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new Error('Wallet wasn`t connected');
  }

  tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));

  console.log(activeAcc);
  return { pkh: activeAcc.address, pk: activeAcc.publicKey, tezos };
};
