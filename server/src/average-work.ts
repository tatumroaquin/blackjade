import Blockchain from './blockchain/chain.js';

const blockchain = new Blockchain();
const timeDiffs = [];

blockchain.addBlock({ data: 'initiate' });

for (let i = 1; i < 500; i++) {
  let prevBlock = blockchain.chain.slice(-1).pop()!;

  blockchain.addBlock({ data: `block ${i}` });

  let nextBlock = blockchain.chain.slice(-1).pop()!;

  let timeDiff = nextBlock.timestamp - prevBlock.timestamp;
  timeDiffs.push(timeDiff);

  let average =
    timeDiffs.reduce((total, time) => total + time) / timeDiffs.length;

  console.log(
    `ETA ${timeDiff}ms. Difficulty ${
      prevBlock.difficulty
    }. AverageWork ${average.toFixed(3)}ms`
  );
}
