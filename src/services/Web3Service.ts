import FactoryABI from "./abis/Factory.abi.json";
import FightingABI from "./abis/Fighting.abi.json";
import RobotsNFTABI from "./abis/RobotsNFT.abi.json";
import RewardTokenABI from "./abis/RewardToken.abi.json";
import RobotMarketABI from "./abis/RobotMarket.abi.json";
import Growing from "./abis/Growing.abi.json";
import { ethers } from "ethers";

const FACTORY_ADDRESS = "0xd7bdD102F7E4b94D3eE6C89575a6fEf07847e87d";
const FIGHTING_ADDRESS = "0x8b94Fff1c610327a589E7968d71215159a9a262A";
const ROBOTSNFT_ADDRESS = "0xab19C6c63106F1AB6767C4376379a490c6d7C03f";
const REWARDTOKEN_ADDRESS = "0x3E3066A43905a60c8a846829c8d521141b025a34";
const ROBOTMARKET_ADDRESS = "0x2231AA1E8dbDcE245D9732Ac37Edf925ba2ce46F";
const GROWING_ADDRESS = "0x79d9889CeE8F996bf3d18842e9F028C3D2f45D26";
const CHAIN_ID = "0xYourChainId";

async function getProvider() {
  if (!window.ethereum) throw new Error(`Wallet not found!`);

  const provider = new ethers.BrowserProvider(window.ethereum);

  const accounts: string[] = await provider.send("eth_requestAccounts", []);

  if (!accounts || !accounts.length) throw new Error(`Wallet not permitted!`);

  await provider.send("wallet_switchEthereumChain", [{ chainId: CHAIN_ID }]);

  return provider;
}

const mintRobot = async (robotId) => {
    const provider = await getProvider();

    const mitingFee = new ethers.Contract(ROBOTMARKET_ADDRESS, RobotMarketABI, provider);
    const tx = await mitingFee.mint(robotId);
    await tx.wait();

  await robotsNFT = new ethers.Contract(ROBOTSNFT_ADDRESS, RobotsNFTABI, provider);
  await robotsNFT.mint(robotId);
}