import { ethers } from "hardhat";

// Etherlink data
// const ENTRY_POINT_CONTRACT_ADDRESS =
//   "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59";
// const ACCOUNT_ADDRESS = "0x946d3ae183c6bd5a8310b188091109e87c10eee4";

// Localhost
const ENTRY_POINT_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  console.log("👟 Start script 'print-deposit-info'");
  const entryPointContract = await ethers.getContractAt(
    "CustomEntryPoint",
    ENTRY_POINT_CONTRACT_ADDRESS
  );
  const paymasterDepositInfo = await entryPointContract.getDepositInfo(
    PAYMASTER_CONTRACT_ADDRESS
  );
  console.log("accountDepositInfo", paymasterDepositInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
