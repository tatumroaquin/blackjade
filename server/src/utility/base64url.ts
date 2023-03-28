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
    if (padding === 1) {
      throw new Error('base64url input is invalid');
    }
    input += '='.repeat(5 - padding);
  }
  return Buffer.from(input, 'base64').toString('hex');
}
//
// const xHex = base64UrlDecode('JzsGXsXmLzU2IWm40Z_JnqSBucyqht5e52o4H3LwJJE');
// const yHex = base64UrlDecode('cyk6zBr05wxsHzigvGSC7-pcIN8MJipKpFe2OUHngGE');
//
// const xRaw = base64UrlEncode('273b065ec5e62f35362169b8d19fc99ea481b9ccaa86de5ee76a381f72f02491');
// const yRaw = base64UrlEncode('73293acc1af4e70c6c1f38a0bc6482efea5c20df0c262a4aa457b63941e78061');
//
// console.log('xHex', xHex);
// console.log('yHex', yHex);
//
// const fullKey = xHex + yHex;
//
// console.log(fullKey.substring(0, fullKey.length / 2));
// console.log(fullKey.substring(fullKey.length / 2));
