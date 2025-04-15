import { ethers } from "ethers";
import contractABI from "./artifacts/contracts/Blockchain.sol/Blockchain.json";

const provider = new ethers.JsonRpcProvider("HTTP://192.168.18.190:8545");

const contractAddress = "0xC9Bfd7E4f15534Eb8F182EccC8F6b196a75D9184";

export async function getContract() {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI.abi, signer);
}
