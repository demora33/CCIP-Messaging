// scripts/deploySender.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Sender must be deployed to Avalanche Fuji`);
    return 1;
  }

  const fujiLinkAddress = `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`;
  const fujiRouterAddress = `0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8`;
  
  await run("compile");

  const ccipSenderFactory = await ethers.getContractFactory("CCIPSender_Unsafe");
  const ccipSender = await ccipSenderFactory.deploy(fujiLinkAddress, fujiRouterAddress);

  await ccipSender.deployed();

  console.log(`CCIPSender_Unsafe deployed to ${ccipSender.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});