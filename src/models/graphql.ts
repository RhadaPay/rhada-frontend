// querying the superfluid api
export interface SuperfluidGraphQLResult {
  tokens: Array<{
    flows: Array<SuperfluidFlow>;
  }>;
}

export interface SuperfluidFlow {
  __typename: string;
  flowRate: string;
  lastUpdate: string;
  sum: string;
}
