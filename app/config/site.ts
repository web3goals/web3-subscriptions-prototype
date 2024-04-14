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
    product: "0x86916184b00b26dceaF63a2cD6c9095314f6e055" as `0x${string}`,
    usdt: "0xe720443310986E173af339fA366A30aa0A1Ea5b2" as `0x${string}`,
    entryPoint: "0x539dA825856778B593a55aC4E8A0Ec1441f18e78" as `0x${string}`,
    paymaster: "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286" as `0x${string}`,
    accountFactory:
      "0xBBae3088AaF60c44Fb932ba82fd0b3dbb2d67C6F" as `0x${string}`,
  },
};
