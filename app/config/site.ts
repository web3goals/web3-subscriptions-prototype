import { Chain, etherlinkTestnet } from "viem/chains";
import { shardeumTestnet } from "./chains";

export type SiteConfig = typeof siteConfig;

export type SiteConfigContracts = {
  chain: Chain;
  product: `0x${string}`;
  usdt: `0x${string}`;
  entryPoint: `0x${string}`;
  paymaster: `0x${string}`;
  accountFactory: `0x${string}`;
  accountAbstractionSuported: boolean;
};

export const siteConfig = {
  emoji: "🔁",
  name: "Web3 Subscriptions",
  description: "A platform to manage crypto subscriptions in a few clicks",
  links: {
    github: "https://github.com/web3goals/web3-subscriptions-prototype",
  },
  contracts: {
    etherlinkTestnet: {
      chain: etherlinkTestnet,
      product: "0x86916184b00b26dceaF63a2cD6c9095314f6e055" as `0x${string}`,
      usdt: "0xe720443310986E173af339fA366A30aa0A1Ea5b2" as `0x${string}`,
      entryPoint: "0x539dA825856778B593a55aC4E8A0Ec1441f18e78" as `0x${string}`,
      paymaster: "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286" as `0x${string}`,
      accountFactory:
        "0xBBae3088AaF60c44Fb932ba82fd0b3dbb2d67C6F" as `0x${string}`,
      accountAbstractionSuported: true,
    } as SiteConfigContracts,
    shardeumTestnet: {
      chain: shardeumTestnet,
      product: "0x418d621b98Cc75a09327725620F9ec949615396E" as `0x${string}`,
      usdt: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59" as `0x${string}`,
      entryPoint: "0x02008a8DBc938bd7930bf370617065B6B0c1221a" as `0x${string}`,
      paymaster: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921" as `0x${string}`,
      accountFactory:
        "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7" as `0x${string}`,
      accountAbstractionSuported: false,
    } as SiteConfigContracts,
  },
};
