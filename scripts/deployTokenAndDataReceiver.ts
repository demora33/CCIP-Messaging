// scripts/deployReceiver.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `ethereumSepolia`) {
    console.error(`❌ Receiver must be deployed to Ethereum Sepolia`);
    return 1;
  }

  const sepoliaRouterAddress = `0xD0daae2231E9CB96b94C8512223533293C3693Bf`;
  const mintingPrice = `100`;

  
  await run("compile");

  const ccipTokenAndDataReceiverFactory = await ethers.getContractFactory("CCIPTokenAndDataReceiver");
  const ccipTokenAndDataReceiver = await ccipTokenAndDataReceiverFactory.deploy(sepoliaRouterAddress, mintingPrice);

  await ccipTokenAndDataReceiver.deployed();

  console.log(`CCIPTokenAndDataReceiver deployed to ${ccipTokenAndDataReceiver.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});