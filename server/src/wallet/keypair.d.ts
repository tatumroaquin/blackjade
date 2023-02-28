export type HexKeyPair = {
  publicKey: string;
  privateKey: string;
};

export type VerifyParams = {
  publicKey?: Buffer | string | undefined;
  data: any;
  signature: string;
};
