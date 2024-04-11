import { ethers } from "hardhat";

// Etherlink
// const ACCOUNT_CONTRACT_ADDRESS = "0x885e9b86e4e2c8b77988f776485f616b31452ca5";

// Localhost
const ACCOUNT_CONTRACT_ADDRESS = "0xB4525059E4a2dae53000c42f4Ee34c0c119ecdef";

async function main() {
  console.log("👟 Start script 'print-account-contract-data'");
  const accountContract = await ethers.getContractAt(
    "Account",
    ACCOUNT_CONTRACT_ADDRESS
  );
  const count = await accountContract.count();
  console.log("count", count);
  const owner = await accountContract.owner();
  console.log("owner", owner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
