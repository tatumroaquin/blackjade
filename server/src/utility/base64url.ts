// https://base64.guru/standards/base64url

export function base64UrlEncode(input: string): string {
  input = Buffer.from(input, 'hex').toString('base64');
  input = input.replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
  return input;
}

export function base64UrlDecode(input: string): string {
  input = input.replace(/_/g, '/').replace(/-/g, '+');

  const padding = input.length % 4;

  if (padding) {
    if (padding === 1) throw new Error('base64url input is invalid');
    input += '='.repeat(5 - padding);
  }
  return Buffer.from(input, 'base64').toString('hex');
}
