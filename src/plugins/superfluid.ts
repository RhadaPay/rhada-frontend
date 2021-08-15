// Please see the README for a primer on the superfluid protocol

import { cashFlowFactory, paymentFactory } from "./ethers";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { ethers } from "ethers";
import { UninitializedError } from "@/errors";
import { Framework } from "@superfluid-finance/js-sdk/src/Framework";
export const SUPERTOKEN_ADDRESS = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

export interface CashFlowAddresses {
  sender: string;
  recipient: string;
  mediator: string;
}

export interface CashFlows {
  current: number;
  max: number;
}

export default class sfWrapper {
  /** Wrap the superfluid logic into a single object
   * Takes a single parameter:
   * @param jobId - the numerical integer of the job, corresponding
   * to the position in the jobs array for the deployed smart contract
   **/
  constructor(
    public jobId: number,

    // default param initialisation
    public addresses = {} as CashFlowAddresses,
    public flows = {} as CashFlows,
    private flowRates = {} as CashFlows,

    private sf = {} as Framework,
    private provider: ethers.providers.Provider = paymentFactory.provider,
    private superTokenAddress: string = SUPERTOKEN_ADDRESS,
    private initialized = false
  ) {}

  public async initialize() {
    this.sf = new SuperfluidSDK.Framework({
      ethers: this.provider,
    });
    await this.getAddresses();
    await this.getFlows();
    await this.sf.initialize();
    this.initialized = true;
  }

  private async getAddresses() {
    this.addresses.sender = await cashFlowFactory.cashflowsSender(this.jobId);
    this.addresses.mediator = await cashFlowFactory.cashflowsRecipient(
      this.jobId
    );
    this.addresses.recipient = await paymentFactory.finalApplicant(this.jobId);
  }

  private async getFlows() {
    this.flowRates.current = (
      await cashFlowFactory.getAllowedFlow(this.jobId)
    ).toNumber();
    this.flowRates.max = (
      await cashFlowFactory.maxAllowedFlows(this.jobId)
    ).toNumber();
    this.flows.current = sfWrapper.flowRatePerMonth(this.flowRates.current);
    this.flows.max = sfWrapper.flowRatePerMonth(this.flowRates.max);
  }

  public static flowRatePerMonth(flowRate: number): number {
    const digits = Math.pow(10, 18);
    const perMonth = 30 * 24 * 3600;
    return Math.round((flowRate * perMonth) / digits);
  }

  public async startPayment(): Promise<void> {
    if (!this.initialized)
      throw new UninitializedError(
        "Cant start payment with uninitialized parameters"
      );
    const user = this.sf.user({
      address: this.addresses.sender,
      token: this.superTokenAddress,
    });

    await user.flow({
      recipient: this.addresses.mediator,
      flowRate: this.flowRates.max,
    });
  }
}
