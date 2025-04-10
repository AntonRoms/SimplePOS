const hre = require("hardhat");

async function main() {
  const ContractDeployer = await hre.ethers.getContractFactory("Blockchain");

  const blockchain = await ContractDeployer.deploy();

  await blockchain.waitForDeployment();

  console.log("Blockchain contract deployed to:", await blockchain.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
