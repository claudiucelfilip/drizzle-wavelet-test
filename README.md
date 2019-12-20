
This is a simple UI to test drizzle with [Wavelet integration](https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration). 
It's connected to the Wavelet testnet and shows a preselected account. It also leverages a simple smart contract which fetches and sets a string variable.


## Usage changes with Wavelet drizzle 
In order to use Wavelet a few config changes for drizzle are needed:
- `drizzleOptions.js` 
  - specify predeployed contract IDs instead of contract names
  - set the wavelet testnet address and privateKey
- `MyComponent.tsx` 
   - specify predeployed contract IDs instead of contract names
  
There might be better options to do this (ex. mapping smart contraxt name to id).

## Main changes in Wavelet drizzle
I'll go through a few of the changes and pain points which appeard during Wavelet integration.

### No ABI
The first and foremost challenge was developing a workaround for the lack of ABI. 
Ethereum smart contracts typically have an ABI which is heavily used by drizzle to manage the redux state object. In other words, it needs to now what are the inputs and outpus of each function.

To work around that, JsonSchema was used extensively in the rust (Wavelet) smart contract to generate a schema for each function. This is then used in drizzle to create a ABI-like structure ([usage](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR57) and [json to abi-like converstion](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR15) ). 

### cacheCall and cacheSend wrapper
Call and send wrapper functions now need to call the equivalent methods from `wavelet-client` (ie test and call respectively) ([cacheSendFunction](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR168), [cacheCallFunction](https://github.com/claudiucelfilip/drizzle/pull/1/files#diff-a2f00ddf44b224fb6d3ddaace4ca9f9fR130)).


### Accounts
One of the most straight forward changes was for accounts as Wavelet uses similar functions.


### Consensus and blocks
Wavelet (0.2) relies on consesus events being sent via websocket, as opposed to blocks. In order to get smart contract updates, a socket handle was added. This triggers an VM memory refresh with new data from the network and then a `CONTRACT_SYNCING` action to start a state update. 

This consists in going through any previously used property (via cachedCall) and replacing their value with new ones ([usage](https://github.com/claudiucelfilip/drizzle/blob/develop/packages/store/src/contracts/contractsSaga.js#L233)). Afterwards, a `CONTRACT_SYNCED` action is dispatched notifying that the state has been changed.

### WaveletContract insted of DrizzleContract
In order to put things together a new WaveletContract class was used instead of DrizzleContract.


### Conclusion
At higher level overview, full Wavelet integration roughly requires adapting the following sagas:
- accountBalances (easy)
- accounts (easy)
- blocks (medium)
- contracts (hard)
- drizzleStatus (medium)
- transactions (easy)
- web3 (medium)
  
One major pain point remains the lack of a proper ABI generation. The current workaround (json schemas) forces developers to write smart contracts in a certain way. Theoretically, drizzle might work without ABI but it'll require more code changes.

Another approach would be to start from scratch, a redux+saga tool and build on top of that. With time we may reach similar complexity (maybe less if we exclude @drizzle/react-component and vue).

# Usage

1. Install Node dependencies 
`cd app && yarn`
  
   - Notice: custom, packed versions of @drizzle/store and @drizzle/react-component are used from the [wavelet-integration](https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration) branch

2. Run create-react-app client
`yarn start`