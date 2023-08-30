import { ethers, network, run } from "hardhat";
import contractABIReceiver from "../abis/CCIPTokenAndDataReceiver.json";

async function main() {
  if (network.name !== `ethereumSepolia`) {
    console.error(`❌ Receiver must be deployed to Ethereum Sepolia`);
    return 1;
  }

  const [owner] = await ethers.getSigners();
  console.log("owner", owner.address);

  const provider = ethers.getDefaultProvider();

  //Senders on fuji
  const ccipTokenAndDataSenderAddr =
    "0x8B3737ECa5f549739aB5619C7C6Dd6bF53221CD4";

  //Receivers on sepolia
  const ccipTokenAndDataReceiverAddr =
    "0xDC35008014a11CA9eAFa9D6778dd4779FCCfc9d9";

  const sourceChainSelector = "14767482510784806043"; // Fuji
  const destinationChainSelector = "16015286601757825753"; // Sepolia

  const ccipTokenAndDataReceiver = new ethers.Contract(
    ccipTokenAndDataReceiverAddr,
    contractABIReceiver,
    provider
  );

  // Let's check if the source chain is whitelisted on the receiver contract
  const isWhitelisted = await ccipTokenAndDataReceiver
    .connect(owner)
    .whitelistedSourceChains(sourceChainSelector);

  console.log("isWhitelisted", isWhitelisted);

  if (!isWhitelisted) {
    const whitelistTx = await ccipTokenAndDataReceiver
      .connect(owner)
      .whitelistSourceChain(sourceChainSelector);
    console.log(`Whitelisted Fuji, transaction hash: ${whitelistTx.hash}`);
  }

  // Let's check if the sender contract is whitelisted on the receiver contract
  const isAddrWhitelisted = await ccipTokenAndDataReceiver
    .connect(owner)
    .whitelistedSenders(ccipTokenAndDataSenderAddr);

  console.log("isAddrWhitelisted", isAddrWhitelisted);
  if (!isAddrWhitelisted) {
    const whitelistSenderTx = await ccipTokenAndDataReceiver
      .connect(owner)
      .whitelistSender(ccipTokenAndDataSenderAddr);
    console.log(
      `Whitelisted Addr, transaction hash: ${whitelistSenderTx.hash}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
