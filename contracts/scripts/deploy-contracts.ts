import { ethers } from "hardhat";
import hre from "hardhat";

export const CONTRACTS: {
  [key: string]: {
    entryPoint: `0x${string}` | undefined;
    accountFactory: `0x${string}` | undefined;
    paymaster: `0x${string}` | undefined;
    product: `0x${string}` | undefined;
    usdToken: `0x${string}` | undefined;
  };
} = {
  etherlinkTestnet: {
    entryPoint: "0x539dA825856778B593a55aC4E8A0Ec1441f18e78",
    accountFactory: "0xBBae3088AaF60c44Fb932ba82fd0b3dbb2d67C6F",
    paymaster: "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286",
    product: "0x86916184b00b26dceaF63a2cD6c9095314f6e055",
    usdToken: "0xe720443310986E173af339fA366A30aa0A1Ea5b2",
  },
};

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (!CONTRACTS[network].entryPoint) {
    const contractFactory = await ethers.getContractFactory("CustomEntryPoint");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'EntryPoint' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].accountFactory) {
    const contractFactory = await ethers.getContractFactory("AccountFactory");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'AccountFactory' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].paymaster) {
    const contractFactory = await ethers.getContractFactory("Paymaster");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'Paymaster' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].product) {
    const contractFactory = await ethers.getContractFactory("Product");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'Product' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].usdToken) {
    const contractFactory = await ethers.getContractFactory("USDToken");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'USDToken' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
