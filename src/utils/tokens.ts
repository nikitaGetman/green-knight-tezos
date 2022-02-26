export function isFA12Token(tokens: any): boolean {
  if (tokens?.standard) return tokens.standard === 'fa1.2';
  return tokens?.length && tokens[0].standard === 'fa1.2';
}

export function isFA2Token(tokens: any): boolean {
  if (tokens?.standard) return tokens.standard === 'fa2';
  return tokens?.length && tokens[0].standard === 'fa2';
}
