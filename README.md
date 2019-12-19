
This is a simple UI to test drizzle with [Wavelet integration](https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration). 
It's connected to the Wavelet tesnet and shows a preselected account. It also leverages a simple smart contract which fetches and set a string variable.


## Usage changes with Wavelet drizzle 
In order to use Wavelet a few changes in drizzle are needed:
- `drizzleOptions.js` 
  - specify predeployed contract IDs instead of contract names
  - set wavelet testnet address and privateKey to be used
- `MyComponent.tsx` 
   - specify predeployed contract IDs instead of contract names
  
There might be better options to do this (such as name to id mapping), but this will do for now.

## Main changes in Wavelet drizzle
I'll go through a few of the changes and pain points which appeard during Wavelet integration

### No ABI
The first and foremost challenge was developing a workaround the lack of ABI. 
Ethereum smart contracts typically have an ABI which is heavily used by drizzle to setup the redux state object. 

Im other words, it needs to now what are the inputs and outpus of each function.

To work around that, JsonSchema was extensively used in the rust (Wavelet) smart contract to generate a schema for each function. This is then used in drizzle to create a ABI-like structure ([usage](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR57) and [json to abi-like converstion](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR15) ). 

### cacheCall and cacheSend wrapper
Call and send wrapper function now needed to call equivalent methods from the wavelet-client library (ie test and call respectively). For now, no caching functionality has been included. ([cacheSendFunction](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR168), [cacheCallFunction](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR130))


### Accounts
One of the most straight forward changes was for accounts as Wavelet uses similar functions


### Consensus and blocks
Wavelet (0.2) relies on consesus events being sent via websocket as opposed to blocks. In order to get change detection add consensus listener. 
This will trigger an VM memory refresh with data from the network and then a `CONTRACT_SYNCING` action to start a state refresh. 

This consists in going through any previously property lookup (via cachedCall) and replacing their value with new ones ([usage](https://github.com/claudiucelfilip/drizzle/blob/develop/packages/store/src/contracts/contractsSaga.js#L233)). 
Afterwards, a `CONTRACT_SYNCED` action is dispatched notifying that the state has been updated.

### WaveletContract insted of DrizzleContract
In order to put things together a new WaveletContract class was used instead of DrizzleContract.


### Conclusion
At higher level overview, proper Wavelet integration roughly requires adapting the following sagas
- accountBalances (easy)
- accounts (easy)
- blocks (medium)
- contracts (hard)
- drizzleStatus (medium)
- transactions (easy)
- web3 (medium)
  
One major pain point remains the lack of a proper ABI generation. The curreng workaround (json schemas) forces developers to write smart contracts in a certain way. Theoretically, drizzle might work with ABI but it'll require more code changes.

Another approach would be to start from scratch, a redux+saga tool and build on top of that. With time we could reach similar complexity (maybe less if we exclude @drizzle/react-component and vue) but would yield and a leaner learning curve.

# Usage

1. Install Node dependencies 
`cd app && yarn`
  
   - Notice: a custom, packed version of @drizzle/store and @drizzle/react-component is used from the [wavelet-integration](https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration) branch

2. Run create-react-app client
`yarn start`