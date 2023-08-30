// scripts/deployReceiver.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `ethereumSepolia`) {
    console.error(`❌ Receiver must be deployed to Ethereum Sepolia`);
    return 1;
  }

  const sepoliaRouterAddress = `0xD0daae2231E9CB96b94C8512223533293C3693Bf`;
  
  await run("compile");

  const ccipReceiverFactory = await ethers.getContractFactory("CCIPReceiver_Unsafe");
  const ccipReceiver = await ccipReceiverFactory.deploy(sepoliaRouterAddress);

  await ccipReceiver.deployed();

  console.log(`CCIPReceiver_Unsafe deployed to ${ccipReceiver.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});