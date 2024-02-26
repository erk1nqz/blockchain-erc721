// scripts/interact.js
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log('Getting the CryptoCoffee NFT contract...\n');
    const myAddress = process.env.OWNER_ADDRESS;
    const contractAddress = "0xecC47Eb502eb72A37515C36616Daf11F811a6936";
    const cryptoCoffee = await ethers.getContractAt('CryptoCoffee', contractAddress);
    const signers = await ethers.getSigners();


    console.log('Querying NFT collection name...');
    const name = await cryptoCoffee.name();
    console.log(`Token Collection Name: ${name}\n`);
    await cryptoCoffee.mint(myAddress, 2, "ipfs://QmXPDNobci5yGredT5zLRp7QLX91pqwFV7N62zybPEPG67/");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });