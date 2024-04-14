import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'mint-usd-token'");

  const network = hre.network.name;

  const [deployer] = await ethers.getSigners();

  const usdTokenContract = await ethers.getContractAt(
    "USDToken",
    CONTRACTS[network].usdToken as `0x${string}`
  );

  const mintTx = await usdTokenContract.mint(3);
  await mintTx.wait();

  const balance = await usdTokenContract.balanceOf(deployer);
  console.log("balance:", balance);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
