# 📊 OBX Subgraph 📊

The OBX Subgraph is an indexer for the OBX decentralized exchange. It provides a scalable and efficient way to access trade and volume data on the OBX exchange. The data is available in the form of GraphQL API, making it easy to query the data and integrate with other applications.

# OBX Subgraph Installation Steps

## Prerequisites
- npm 
- yarn
- the-graph-cli

## Installation
1. Clone the OBX subgraph repository: 

```
git clone https://github.com/obxdex/subgraph-api.git
```
2. Go to the specific subgraph folder, for example `wmatic-usdc`: 
```
cd subgraph-api/wmatic-usdc
```
3. Run the following command to generate the graph code:
```
graph codegen
```
4. Build the subgraph:
```
graph build
```
5. Deploy the subgraph:
```
graph deploy --product hosted-service <name of subgraph>
```

Note: you will need authentication

use
```
graph auth --product hosted-service <your token>
```

Note 2: Changes can be made in the `subgraph.yaml` , `schema.graphql` and `src/obx-exchange.ts` files for customizations.

## Entity Types
The OBX subgraph has the following entity types:

### Trade: contains information about a trade that has occurred on OBX exchange choosen pair. It includes the following fields:
- id
- otype - the order type (BUY,SELL)
- price
- amountGet - amount of token received for the maker
- amountGive - amount of token given from the taker
- timestamp
- transactionHash
- blockNumber
- userFill - the taker of the order
- userFilled - the maker of the order
- volumeInQuote - volume in quote token at the order execution

### Info: contains various statistics about the OBX exchange choosen pair. It includes the following fields:
- id
- lastTrackedBlock
- lastTrade
- lastTrackedTrade
- lastPrice
- last24HourVolume
- trackedDay

### DayVolume: contains the 24-hour volume for each day on that pair. It includes the following fields:
- id
- dayNumber
- volume24hours

### Each trading pair has its own data using this structure and can be accessed through its respective API endpoint:

* [WMATIC-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/wnatic-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/wmatic-usdc
* [WMATIC-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/wnatic-brz) - https://api.thegraph.com/subgraphs/name/obxdex/wmatic-brz
* [KRSTM-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/krstm-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/krstm-usdc
* [KRSTM-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/krstm-brz) - https://api.thegraph.com/subgraphs/name/obxdex/krstm-brz
* [ETH-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/eth-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/eth-usdc
* [ETH-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/eth-brz) - https://api.thegraph.com/subgraphs/name/obxdex/eth-brz
* [BNB-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/bnb-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/bnb-usdc
* [BNB-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/bnb-brz) - https://api.thegraph.com/subgraphs/name/obxdex/bnb-brz
* [WBTC-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/wbtc-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/wbtc-usdc
* [WBTC-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/wbtc-brz) - https://api.thegraph.com/subgraphs/name/obxdex/wbtc-brz
* [LINK-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/link-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/link-usdc
* [USDT-USDC](https://thegraph.com/hosted-service/subgraph/obxdex/usdt-usdc) - https://api.thegraph.com/subgraphs/name/obxdex/usdt-usdc
* [USDC-BRZ](https://thegraph.com/hosted-service/subgraph/obxdex/usdc-brz) - https://api.thegraph.com/subgraphs/name/obxdex/usdc-brz

## Example Queries
Here is a sample GraphQL query that retrieves the latest 10 trades of a trading pair:
```
query {
  trades(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    otype
    price
    timestamp
    transactionHash
    userFill
    userFilled
    volumeInQuote
  }
}

```
The following is an example query that returns the total volume traded in a OBX exchange pair in the last 24 hours:
```
query {
  infos {
    last24HourVolume
  }
}
```


