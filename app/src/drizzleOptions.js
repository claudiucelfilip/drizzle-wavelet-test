const Storage = require("./contracts/Storage.json");

const options = {
  contracts: ["2ef49b793f0f7de817d2a80e43ceaf1a781f265ad77d3f7a02b8a0e20706ca2a"],
  // contracts: [Storage],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545"
    }
  },
  wavelet: {
    host: "https://tradenet.perlin.net",
    privateKey: "85e7450f7cf0d9cd1d1d7bf4169c2f364eea4ba833a7280e0f931a1d92fd92c2696937c2c8df35dba0169de72990b80761e51dd9e2411fa1fce147f68ade830a"
  }
};
module.exports = options;
