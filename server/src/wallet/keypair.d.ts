export type HexKeyPair = {
  publicKey: string;
  privateKey: string;
};

export type GlobalVerify = {
  publicKey: Buffer | string;
  data: any;
  signature: string;
};

export type SelfVerify = {
  data: any;
  signature: string;
};
