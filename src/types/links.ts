export type TokenType = {
  name?: string;
  symbol?: string;
  icon?: string;
  contract: string;
  standard: 'fa1.2' | 'fa2';
  tokenId: string;
  totalMinted?: string;
  totalBurned?: string;
  totalSupply?: string;
  metadata: {
    decimals: string;
    image?: string;
    thumbnailUri?: string;
    displayUri?: string;
    artifactUri?: string;
  };
};

export enum LinkTypes {
  Telegram = 'telegram',
  Discord = 'discord',
  Http = 'http',
}

export type LinkType = {
  title?: string;
  minBalance?: string;
  token?: TokenType;
  type: LinkTypes;
};
