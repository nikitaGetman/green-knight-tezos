export type TokenType = {
  name?: string;
  icon?: string;
  contract?: string;
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
