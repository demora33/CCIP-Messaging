// scripts/sendMessage.ts

import { ethers, network } from "hardhat";
import contractABI from '../abis/CCIPSender_Unsafe.json';

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const [owner] = await ethers.getSigners();
  console.log('owner', owner.address);

  const provider = ethers.getDefaultProvider()

  const ccipSenderAddress = '0xa59581decc20ddfb1550af689b85f394b69e55d8';
  const ccipReceiverAddress = '0xA59581DECc20Ddfb1550af689b85f394B69E55D8';
  const someText = `Hello I'm Alfonso and this is my first cross-chain message`;
  const destinationChainSelector = '16015286601757825753';

  const ccipSender = new ethers.Contract(ccipSenderAddress, contractABI, provider);

  const tx = await ccipSender.connect(owner).send(
      ccipReceiverAddress, 
      someText,
      destinationChainSelector
  );

//   const contractOwner = await ccipSender.connect(owner).owner();

  console.log(`Transaction hash: ${tx.hash}`);
//   console.log(`contractOwner: ${contractOwner}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});