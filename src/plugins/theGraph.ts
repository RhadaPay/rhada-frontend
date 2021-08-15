import { SuperfluidFlow, SuperfluidGraphQLResult } from "@/models/graphql";
import { ApolloQueryResult, gql } from "apollo-boost";
import { ApolloProvider } from "vue-apollo";

export const query = (
  cashflowAddress: string,
  finalApplicant: string
): string => {
  /*
   * TheGraph query on https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai
   * IMPORTANT: both addresses must be lowercase and the formula to calculate the total received is: sum + flowRate(currentTimestamp-lastUpdate)
   */
  return `{
    tokens(where: { symbol: "fDAIx" }) {
        flows(
            where: {
              owner: "${cashflowAddress.toLowerCase()}"
              recipient: "${finalApplicant.toLowerCase()}"
            }
          ) 
        {
          sum
          flowRate
          lastUpdate
        }
      }
    }`;
};

export const getPaymentDetails = async (
  client: ApolloProvider,
  query: string
): Promise<SuperfluidFlow> => {
  /*
    Query the graph for current details of the superfluid flow
  */
  const result: ApolloQueryResult<SuperfluidGraphQLResult> =
    await client.defaultClient.query({
      query: gql(query),
    });
  const flow = result.data.tokens[0].flows[0];
  return flow;
};

export const calculateTotalTransferred = (flow: SuperfluidFlow): number => {
  // https://docs.superfluid.finance/superfluid/docs/subgraph#how-much-usdcx-has-alice-streamed-to-bob
  const sum = Number(flow.sum);
  const flowRate = Number(flow.flowRate);
  const lastUpdate = Number(flow.lastUpdate);
  const nowInSeconds = Math.round(Date.now() / 1000);

  const sinceNow = nowInSeconds - lastUpdate;
  const formula: number = sum + flowRate * sinceNow;

  return formula / Math.pow(10, 18);
};
