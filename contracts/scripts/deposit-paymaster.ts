import { ethers } from "hardhat";

// Etherlink data
// const ENTRY_POINT_CONTRACT_ADDRESS =
//   "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59";
// const DEPOSIT_TO_ADDRESS = "0xa7374e2dd605eb403a0caa27977845b57a58d76d";

// Localhost data
const ENTRY_POINT_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  console.log("👟 Start script 'deposit-paymaster'");
  const entryPointContract = await ethers.getContractAt(
    "CustomEntryPoint",
    ENTRY_POINT_CONTRACT_ADDRESS
  );
  await entryPointContract.depositTo(PAYMASTER_CONTRACT_ADDRESS, {
    value: ethers.parseEther("1"),
  });
  const paymasterDepositInfo = await entryPointContract.getDepositInfo(
    PAYMASTER_CONTRACT_ADDRESS
  );
  console.log("paymasterDepositInfo:", paymasterDepositInfo);
  console.log("🏁 Script finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
