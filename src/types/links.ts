export enum TokenStandards {
  'fa1.2' = 'fa1.2',
  'fa2' = 'fa2',
}
export type TokenMetadata = {
  decimals: string;
  image?: string;
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
  name?: string;
  symbol?: string;
};

export type TokenType = {
  name?: string;
  symbol?: string;
  icon?: string;
  contract: string;
  standard: TokenStandards;
  tokenId: string;
  totalMinted?: string;
  totalBurned?: string;
  totalSupply?: string;
  metadata: TokenMetadata;
};

export enum LinkTypes {
  Telegram = 'telegram',
  Discord = 'discord',
  Http = 'http',
}
export type LinkType = {
  minBalance?: string;
  tokenId: string | number;
  linkType: LinkTypes;
  // link?: string;
};

export type SecureLinkType = {
  id: string;
  title: string;
  token: {
    contract: string;
    standard: TokenStandards;
    metadata: TokenMetadata;
  };
  links: LinkType[];
  isSeparateLinks?: boolean;
};
