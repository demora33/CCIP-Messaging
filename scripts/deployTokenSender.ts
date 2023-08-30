// scripts/deployTokenSender.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Sender must be deployed to Avalanche Fuji`);
    return 1;
  }

  const fujiLinkAddress = `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`;
  const fujiRouterAddress = `0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8`;
  
  await run("compile");

  const ccipTokenAndDataSenderFactory = await ethers.getContractFactory("CCIPTokenAndDataSender");
  const ccipTokenAndDataSender = await ccipTokenAndDataSenderFactory.deploy(fujiLinkAddress, fujiRouterAddress);

  await ccipTokenAndDataSender.deployed();

  console.log(`CCIPTokenAndDataSender deployed to ${ccipTokenAndDataSender.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});