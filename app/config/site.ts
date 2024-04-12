import { etherlinkTestnet } from "viem/chains";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  emoji: "🔁",
  name: "Web3 Subscriptions",
  description: "A platform to manage crypto subscriptions in a few clicks",
  links: {
    github: "https://github.com/web3goals/web3-subscriptions-prototype",
  },
  contracts: {
    chain: etherlinkTestnet,
    product: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    usdt: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};
