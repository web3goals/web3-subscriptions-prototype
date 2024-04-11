import { ethers } from "hardhat";

// Etherlink data
// const ENTRY_POINT_CONTRACT_ADDRESS =
//   "0x539dA825856778B593a55aC4E8A0Ec1441f18e78";
// const PAYMASTER_CONTRACT_ADDRESS = "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286";

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
