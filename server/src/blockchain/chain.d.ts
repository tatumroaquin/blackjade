import Block from './block.js';

export type ReplaceChainParams = {
  chain: Block[];
  skipValidation?: boolean;
  onSuccess?: () => void;
};
