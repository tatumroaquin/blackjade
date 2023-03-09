export type HexKeyPair = {
  publicKey: string;
  privateKey: string;
};

export type GlobalVerifyParams = {
  publicKey: Buffer | string;
  data: any;
  signature: string;
};

export type SelfVerifyParams = {
  data: any;
  signature: string;
};
