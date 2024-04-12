import { ethers } from "hardhat";

// Etherlink data
export const CONTRACTS = {
  entryPoint: "0x539dA825856778B593a55aC4E8A0Ec1441f18e78",
  accountFactory: "0x1F2c31D5034F27A4352Bc6ca0fc72cdC32809808",
  paymaster: "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286",
  product: "0x30C78bB0E789095ff0995d5Ea5CC1f4B357417c6",
  usdToken: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
};

async function main() {
  console.log("👟 Start script 'deploy-contracts'");
  if (!CONTRACTS.entryPoint) {
    const contractFactory = await ethers.getContractFactory("CustomEntryPoint");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'EntryPoint' deployed to: ${await contract.getAddress()}`
    );
  }
  if (!CONTRACTS.accountFactory) {
    const contractFactory = await ethers.getContractFactory("AccountFactory");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'AccountFactory' deployed to: ${await contract.getAddress()}`
    );
  }
  if (!CONTRACTS.paymaster) {
    const contractFactory = await ethers.getContractFactory("Paymaster");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'Paymaster' deployed to: ${await contract.getAddress()}`
    );
  }
  if (!CONTRACTS.product) {
    const contractFactory = await ethers.getContractFactory("Product");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'Product' deployed to: ${await contract.getAddress()}`
    );
  }
  if (!CONTRACTS.usdToken) {
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
