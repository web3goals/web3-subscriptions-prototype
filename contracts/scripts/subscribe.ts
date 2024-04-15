import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'subscribe'");

  const network = hre.network.name;

  const productContract = await ethers.getContractAt(
    "Product",
    CONTRACTS[network].product as `0x${string}`
  );
  const result = await productContract.subscribe(2);
  console.log("result", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
