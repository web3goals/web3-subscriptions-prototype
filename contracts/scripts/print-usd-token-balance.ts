import { ethers } from "hardhat";

// Localhost
const USD_TOKEN_CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const ACCOUNT_ADDRESS = "0x282E47c595296b7f1eC62abBb8FB86106567139E";

async function main() {
  console.log("👟 Start script 'print-usd-token-balance'");
  const usdTokenContract = await ethers.getContractAt(
    "USDToken",
    USD_TOKEN_CONTRACT_ADDRESS
  );
  const balance = await usdTokenContract.balanceOf(ACCOUNT_ADDRESS);
  console.log("balance:", balance);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
