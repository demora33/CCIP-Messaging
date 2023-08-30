// scripts/transferTokens.ts

import { ethers, network } from "hardhat";
import contractABISender from "../abis/CCIPTokenAndDataSender.json";
import contractABIReceiver from "../abis/CCIPTokenAndDataReceiver.json";


async function main() {
  if (network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const [owner] = await ethers.getSigners();
  console.log("owner", owner.address);

  const provider = ethers.getDefaultProvider();

  const receiver = `0x269C310CA85D31Df0a33c2fA3ABb8d82CE55C504`;
  const destinationChainSelector = "16015286601757825753"; // Sepolia
  const sourceChainSelector = "14767482510784806043"; // Fuji


  // Senders deployed on fuji
  const ccipTokenSenderAddr = "0x3C11B3F6B26eDB6BB6077313591286fE74e24388";
  const ccipTokenAndDataSenderAddr =
    "0x8B3737ECa5f549739aB5619C7C6Dd6bF53221CD4";

  //Receivers on sepolia
  const ccipTokenAndDataReceiverAddr =
    "0xDC35008014a11CA9eAFa9D6778dd4779FCCfc9d9";

  const ccipBnMAddress = `0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4`;
  const amountInWei = "100";

  const ccipTokenAndDataSender = new ethers.Contract(
    ccipTokenAndDataSenderAddr,
    contractABISender,
    provider
  );

  const isWhitelisted = await ccipTokenAndDataSender
    .connect(owner)
    .whitelistedChains(destinationChainSelector);

  console.log("isWhitelisted", isWhitelisted);

  if (isWhitelisted) {
    const transferTx = await ccipTokenAndDataSender
      .connect(owner)
      .transferTokens(
        destinationChainSelector,
        ccipTokenAndDataReceiverAddr,
        ccipBnMAddress,
        amountInWei
      );
    console.log(`Tokens sent, transaction hash: ${transferTx.hash}`);

    // await ccipTokenAndDataSender.connect(owner).withdrawToken(receiver, ccipBnMAddress);
  } else {
    const whitelistTx = await ccipTokenAndDataSender
      .connect(owner)
      .whitelistChain(destinationChainSelector);

    console.log(`Whitelisted Sepolia, transaction hash: ${whitelistTx.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
