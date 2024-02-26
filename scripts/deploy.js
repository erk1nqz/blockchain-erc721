const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const CryptoCoffee = await hre.ethers.getContractFactory("CryptoCoffee");
  const cryptoCoffee = await CryptoCoffee.deploy(process.env.OWNER_ADDRESS);

  await cryptoCoffee.waitForDeployment();

  console.log("CryptoCoffee deployed successfully to: ", await cryptoCoffee.getAddress())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});