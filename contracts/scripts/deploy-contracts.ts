import { ethers } from "hardhat";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");
  const entryPointContractFactory = await ethers.getContractFactory(
    "CustomEntryPoint"
  );
  const entryPointContract = await entryPointContractFactory.deploy();
  await entryPointContract.waitForDeployment();
  console.log(
    `Contract 'EntryPoint' deployed to: ${await entryPointContract.getAddress()}`
  );
  const accountFactoryContractFactory = await ethers.getContractFactory(
    "AccountFactory"
  );
  const accountFactoryContract = await accountFactoryContractFactory.deploy();
  await accountFactoryContract.waitForDeployment();
  console.log(
    `Contract 'AccountFactory' deployed to: ${await accountFactoryContract.getAddress()}`
  );
  const paymasterContractFactory = await ethers.getContractFactory("Paymaster");
  const paymasterContract = await paymasterContractFactory.deploy();
  await paymasterContract.waitForDeployment();
  console.log(
    `Contract 'Paymaster' deployed to: ${await paymasterContract.getAddress()}`
  );
  const usdTokenContractFactory = await ethers.getContractFactory("USDToken");
  const usdTokenContract = await usdTokenContractFactory.deploy();
  await usdTokenContract.waitForDeployment();
  console.log(
    `Contract 'USDToken' deployed to: ${await usdTokenContract.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
