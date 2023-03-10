export const DUMMY_BLOCKCHAIN = [
  {
    "timestamp": 1674971522141,
    "prevHash": "ORIGIN",
    "hash": "GENESIS-HASH",
    "nonce": 0,
    "difficulty": 3,
    "data": [
      {
        "id": "GENESIS-TXID"
      }
    ]
  },
  {
    "timestamp": 1678435012071,
    "prevHash": "GENESIS-HASH",
    "hash": "212b378740501fa54464e878387881453c0030e02f9cbbe00f79de059afbe5a1",
    "nonce": 6,
    "difficulty": 2,
    "data": [
      {
        "id": "dd3bc39b-42d2-4ce6-af88-6d41d95d141c",
        "input": {
          "timestamp": 1678434958153,
          "wallet": "3056301006072a8648ce3d020106052b8104000a0342000447957b8d121380beb5d33d0b5cbc3b44d6d593c63fef9fd601bd4c1839ab49042eaf20caa563ea6b2669d4f6719d99590747ec067f725f654b84cd1a9cad5aa5",
          "amount": 50,
          "signature": "304402207d6cc9ff39fe01008166b71c50cf78d84bb2ee5b102a29be751affde16c440eb02200b8d6a16fc6917795c0c3980103de930906a885228db8f26a0ad55f0023f8fda"
        },
        "output": {
          "asdfgh": 1,
          "3056301006072a8648ce3d020106052b8104000a0342000447957b8d121380beb5d33d0b5cbc3b44d6d593c63fef9fd601bd4c1839ab49042eaf20caa563ea6b2669d4f6719d99590747ec067f725f654b84cd1a9cad5aa5": 35,
          "qwerty": 2,
          "foo": 3,
          "bar": 4,
          "zoo": 5
        }
      },
      {
        "id": "6b3df821-58f3-4fbe-946f-d6cb748efb7a",
        "input": {
          "timestamp": 1678435012069,
          "wallet": "3056301006072a8648ce3d020106052b8104000a034200048b89de97565a3111e36bc54b435bb27918eb567a0d0a788b5670bdcdc238c10fdbe5c31d737bb92529b093ff07905ebad5827b8e2721880dd1896463764a67ea",
          "amount": 20,
          "signature": "3044022066f11d1e24bfbb897de7f117defa63af94aca64035f14836f09d54e52a4b877c022025c71492bf30d718bcfa6fc07f9733a6b5a7f8b086a3bbacc5c36fe9bd4fca8f",
          "type": "MINER-REWARD"
        },
        "output": {
          "3056301006072a8648ce3d020106052b8104000a0342000447957b8d121380beb5d33d0b5cbc3b44d6d593c63fef9fd601bd4c1839ab49042eaf20caa563ea6b2669d4f6719d99590747ec067f725f654b84cd1a9cad5aa5": 20
        }
      }
    ]
  }
]
