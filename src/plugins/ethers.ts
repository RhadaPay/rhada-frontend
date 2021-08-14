import {
  TradeableCashflowWithAllowanceFactory,
  TradeableCashflowWithAllowanceFactory__factory,
} from "@/models/typechain";
import { PaymentFactory__factory } from "@/models/typechain/factories/PaymentFactory__factory";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xd6a21d46beD2E7A36Cb6Fbe22b251a367c144395";
const CASHFLOW_CONTRACT_ADDRESS = "0x8a32E77B26fb724A5A1d696503597ae809Cae374";

declare global {
  interface Window {
    ethereum: {
      request(...args: any[]): Promise<ethers.providers.Provider>;
      selectedAddress: string;
    };
  }
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const paymentFactory = PaymentFactory__factory.connect(
  CONTRACT_ADDRESS,
  signer
);

export const cashFlowFactory =
  TradeableCashflowWithAllowanceFactory__factory.connect(
    CASHFLOW_CONTRACT_ADDRESS,
    signer
  );
