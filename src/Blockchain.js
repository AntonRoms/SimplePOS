import { ethers } from "ethers";
import contractABI from "./artifacts/contracts/Blockchain.sol/Blockchain.json";

const provider = new ethers.JsonRpcProvider("HTTP://192.168.18.190:8545");

const contractAddress = "0xa467B9F1192bE391a7dAeb78D33217B8617f5dBb";

export async function getContract() {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI.abi, signer);
}
