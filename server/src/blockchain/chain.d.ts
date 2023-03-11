import Blockchain from './chain.js';

export type ReplaceChain = {
  blockchain: Blockchain;
  skipValidation?: boolean;
  onSuccess?: () => void;
};
