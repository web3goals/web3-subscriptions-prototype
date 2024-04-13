import { ethers } from "hardhat";

// Etherlink data
// const ENTRY_POINT_CONTRACT_ADDRESS =
//   "0x539dA825856778B593a55aC4E8A0Ec1441f18e78";
// const ACCOUNT_FACTORY_CONTRACT_ADDRESS =
//   "0x1F2c31D5034F27A4352Bc6ca0fc72cdC32809808";
// const PAYMASTER_CONTRACT_ADDRESS = "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286";
// const USD_TOKEN_CONTRACT_ADDRESS = "0xe720443310986E173af339fA366A30aa0A1Ea5b2";

// Localhost data
const ENTRY_POINT_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_FACTORY_CONTRACT_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const USD_TOKEN_CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function main() {
  console.log("👟 Start script 'sandbox'");

  // Get signers
  const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();

  // Define factories
  const accountFactoryContractFactory = await ethers.getContractFactory(
    "AccountFactory"
  );
  const accountContractFactory = await ethers.getContractFactory("Account");
  const usdTokenContractFactory = await ethers.getContractFactory("USDToken");

  // Define contracts
  const entryPointContract = await ethers.getContractAt(
    "CustomEntryPoint",
    ENTRY_POINT_CONTRACT_ADDRESS
  );

  let initCode =
    ACCOUNT_FACTORY_CONTRACT_ADDRESS +
    accountFactoryContractFactory.interface
      .encodeFunctionData("createAccount", [await deployer.getAddress()])
      .slice(2);
  console.log("initCode:", initCode);

  let sender;
  try {
    await entryPointContract.getSenderAddress(initCode);
  } catch (error: any) {
    // sender = "0x" + error.data.slice(-40); // For Etherlink
    sender = "0x" + error.data.message.slice(-43, -3); // For localhost
  }
  console.log("sender:", sender);

  const code = await ethers.provider.getCode(sender as string);
  if (code !== "0x") {
    initCode = "0x";
  }
  console.log("code:", code);

  const nonce = Number(await entryPointContract.getNonce(sender as string, 0));
  console.log("nonce:", nonce);

  // const callData =
  //   accountContractFactory.interface.encodeFunctionData("execute");
  const callData = accountContractFactory.interface.encodeFunctionData(
    "execute",
    [
      USD_TOKEN_CONTRACT_ADDRESS,
      ethers.ZeroHash,
      usdTokenContractFactory.interface.encodeFunctionData("mint", [2]),
    ]
  );
  console.log("callData:", callData);

  const userOp = {
    sender: sender as string,
    nonce: "0x" + nonce.toString(16),
    initCode,
    callData,
    callGasLimit: "0x" + Number(10_000_000).toString(16),
    verificationGasLimit: "0x" + Number(500_000).toString(16),
    preVerificationGas: "0x" + Number(100_000).toString(16),
    maxFeePerGas: "0x" + Number(ethers.parseUnits("2", "gwei")).toString(16),
    maxPriorityFeePerGas:
      "0x" + Number(ethers.parseUnits("2", "gwei")).toString(16),
    paymasterAndData: PAYMASTER_CONTRACT_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const userOpHash = await entryPointContract.getUserOpHash(userOp);
  const signature = await deployer.signMessage(ethers.getBytes(userOpHash));
  userOp.signature = signature;
  console.log("signature:", signature);

  // Handle user operation without bundler
  const tx = await entryPointContract.handleOps(
    [userOp],
    await deployer.getAddress()
  );
  console.log("tx.hash:", tx.hash);

  console.log("🏁 Script finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
