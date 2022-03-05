// import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { char2Bytes } from '@taquito/utils';
import { NetworkType, RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';

const APP_NAME = 'Test app';

export class WalletController {
  // private tezos;
  private network: NetworkType;
  private wallet: BeaconWallet;
  private accountAddress: string = '';
  private signature: string = '';

  constructor(network = NetworkType.HANGZHOUNET) {
    this.network = network;

    const options = {
      name: APP_NAME,
      iconUrl: `${process.env.REACT_APP_BASE_FRONT_URL}/favicon.ico`,
      preferredNetwork: this.network,
    };

    this.wallet = new BeaconWallet(options);

    // this.tezos = new TezosToolkit(accountSettings.provider);
  }
  getAccountAddress() {
    return this.accountAddress;
  }
  getSignature() {
    return this.signature;
  }

  loadActiveAccount() {
    return this.wallet.client.getActiveAccount().then((account) => {
      if (account) {
        this.accountAddress = account.address;
      }
      return account;
    });
  }

  clearActiveAccount() {
    return this.wallet.client.clearActiveAccount().then(() => {
      this.accountAddress = '';
    });
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
        return activeAccount.address;
      }

      await this.clearActiveAccount();
    }

    try {
      const permissions = await this.wallet.client.requestPermissions(options);
      this.accountAddress = permissions.accountInfo.address;
      return this.accountAddress;
    } catch (e: any) {
      console.log(e);
      throw e?.title;
    }
  }

  async requestSign() {
    // The data to format
    const timestamp = new Date().toISOString();
    const input = 'Hello!';

    // The full string
    const formattedInput: string = ['Tezos Signed Message:', APP_NAME, timestamp, input].join(' ');

    // The bytes to sign
    const bytes = char2Bytes(formattedInput);
    const payloadBytes = '05' + '01' + char2Bytes(String(bytes.length)) + bytes;

    // The payload to send to the wallet
    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: payloadBytes,
      sourceAddress: this.accountAddress,
    };

    try {
      // The signing
      const signedPayload = await this.wallet.client.requestSignPayload(payload);
      // The signature
      const { signature } = signedPayload;
      this.signature = signature;
      return signature;
    } catch (e: any) {
      console.error(e);
      throw e?.title;
    }
  }
}

export default new WalletController();
