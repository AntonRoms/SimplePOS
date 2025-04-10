import { ethers } from "ethers";
import contractABI from "./artifacts/contracts/Blockchain.sol/Blockchain.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = provider.getSigner();

const contractAddress = "0xC9Bfd7E4f15534Eb8F182EccC8F6b196a75D9184";

const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

export async function registerReceiptOnChain(receiptHash, companyName) {
  try {
    const tx = await contract.registerReceipt(receiptHash, companyName);
    await tx.wait();
    console.log("✅ Receipt registered on blockchain:", tx.hash);
    return tx.hash;
  } catch (err) {
    console.error("❌ Error registering receipt:", err);
    throw err;
  }
}
