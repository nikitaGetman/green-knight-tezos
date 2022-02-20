export type TokenType = {
  name?: string;
  icon?: string;
  contract?: string;
};

export enum RuleTypes {
  Telegram = 'telegram',
  Discord = 'discord',
  Http = 'http',
}

export type RuleType = {
  title?: string;
  balance?: string;
  token?: TokenType;
  type: RuleTypes;
};
