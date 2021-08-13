import { PaymentFactory__factory } from "@/models/typechain/factories/PaymentFactory__factory";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xd6a21d46beD2E7A36Cb6Fbe22b251a367c144395";

declare global {
  interface Window {
    ethereum: {
      request(...args: any[]): Promise<ethers.providers.Provider>;
      selectedAddress: string;
    };
  }
};

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner()

export const paymentFactory = PaymentFactory__factory.connect(CONTRACT_ADDRESS, signer);