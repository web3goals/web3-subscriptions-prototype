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
    product: "0x30C78bB0E789095ff0995d5Ea5CC1f4B357417c6" as `0x${string}`,
    usdt: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as `0x${string}`,
  },
};
