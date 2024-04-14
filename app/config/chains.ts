import { Chain } from "viem/chains";

export const shardeumTestnet: Chain = {
  id: 8082,
  name: "Shardeum Testnet",
  nativeCurrency: { name: "SHARDEUM", symbol: "SHM", decimals: 18 },
  rpcUrls: { default: { http: ["http://18.185.76.64:8080"] } },
  blockExplorers: {
    default: {
      name: "Shardeum Testnet Explorer",
      url: "https://explorer-hackathon.shardeum.org/",
    },
  },
  testnet: true,
};
