"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import FactoryABI from "../services/abis/Factory.abi.json";
import FightingABI from "../services/abis/Fighting.abi.json";
import RobotsNFTABI from "../services/abis/RobotsNFT.abi.json";
import RewardTokenABI from "../services/abis/RewardToken.abi.json";

const FACTORY_ADDRESS = "0xYourFactoryContractAddress";
const FIGHTING_ADDRESS = "0xYourFightingContractAddress";
const ROBOTSNFT_ADDRESS = "0xYourRobotsNFTContractAddress";
const REWARDTOKEN_ADDRESS = "0xYourRewardTokenContractAddress";
const CHAIN_ID = "0xYourChainId";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fighting, setFighting] = useState(null);
  const [robotsNFT, setRobotsNFT] = useState(null);
  const [rewardToken, setRewardToken] = useState(null);
  const [balance, setBalance] = useState("0");
  const [robotIds, setRobotIds] = useState([]);
  const [arenaId, setArenaId] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        const accounts = await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        const network = await tempProvider.getNetwork();
        if (network.chainId !== parseInt(CHAIN_ID)) {
          await tempProvider.send("wallet_switchEthereumChain", [
            { chainId: CHAIN_ID },
          ]);
        }

        const tempFactory = new ethers.Contract(
          FACTORY_ADDRESS,
          FactoryABI,
          tempSigner
        );
        const tempFighting = new ethers.Contract(
          FIGHTING_ADDRESS,
          FightingABI,
          tempSigner
        );
        const tempRobotsNFT = new ethers.Contract(
          ROBOTSNFT_ADDRESS,
          RobotsNFTABI,
          tempSigner
        );
        const tempRewardToken = new ethers.Contract(
          REWARDTOKEN_ADDRESS,
          RewardTokenABI,
          tempSigner
        );

        setFactory(tempFactory);
        setFighting(tempFighting);
        setRobotsNFT(tempRobotsNFT);
        setRewardToken(tempRewardToken);

        const address = await tempSigner.getAddress();
        const balance = await tempProvider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } else {
        console.error("Wallet not found!");
      }
    };

    initProvider();
  }, []);

  const mintRobot = async () => {
    const mintingFee = await factory.mintingFeeInEth();
    const tx = await factory.mintRobotWithEth({ value: mintingFee });
    await tx.wait();
    alert("Robot minted successfully!");
  };

  const createArena = async (robotId) => {
    await robotsNFT.approve(FIGHTING_ADDRESS, robotId);
    await rewardToken.approve(FIGHTING_ADDRESS, ethers.utils.parseEther("1"));
    const tx = await fighting.createArena(robotId);
    await tx.wait();
    setArenaId(tx.logs[0].args[0].toNumber());
    alert("Arena created successfully!");
  };

  const enterArena = async (robotId) => {
    await robotsNFT.approve(FIGHTING_ADDRESS, robotId);
    await rewardToken.approve(FIGHTING_ADDRESS, ethers.utils.parseEther("1"));
    const tx = await fighting.enterArena(arenaId, robotId);
    await tx.wait();
    alert("Entered arena successfully!");
  };

  return (
    <div>
      <h1>Robot Fighting Arena</h1>
      <p>Balance: {balance} ETH</p>
      <button onClick={mintRobot}>Mint Robot</button>
      <input
        type="number"
        placeholder="Robot ID"
        onChange={(e) => setRobotIds([...robotIds, e.target.value])}
      />
      <button onClick={() => createArena(robotIds[0])}>Create Arena</button>
      <button onClick={() => enterArena(robotIds[1])}>Enter Arena</button>
    </div>
  );
}

export default App;
