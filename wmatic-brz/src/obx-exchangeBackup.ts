import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client/react/hooks';
import { QueryHookOptions } from '@apollo/client/react/types/types';

import {
  OBXExchange,
  OwnershipTransferred as OwnershipTransferredEvent,
  Trade as TradeEvent
} from "../generated/OBXExchange/OBXExchange"
import { OwnershipTransferred, Trade } from "../generated/schema"
import { BigDecimal, Address, BigInt,store,Bytes, ethereum} from '@graphprotocol/graph-ts/index'
import {
  convertTokenToDecimal,
  ADDRESS_ZERO,
  FACTORY_ADDRESS,
  ONE_BI,
  ZERO_BD,
  BI_18,
  BI_6,
  BI_3,
  exponentToBigDecimal
} from './helpers'

/*
Query to get last price on subgraph

{
  trades(orderBy: timestamp, orderDirection: desc, first: 1) {
    otype
    price
    amountGet
  }
}

/*
const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/obxdex/wmatic-usdc',
});
*/

/*
const TRADES_QUERY = gql`
  query Trades($startBlock: BigInt!, $endBlock: BigInt!) {
    trades(first: 100000, where: {blockNumber_gte: $startBlock, blockNumber_lte: $endBlock}, orderBy: "timestamp", orderDirection: "desc") {
      id
      amountGet
      amountGive
      timestamp
    }
  }
`;

const PRICE_QUERY = gql`
  query Trades() {
    trades(first: 1, orderBy: "timestamp", orderDirection: "desc") {
      id
      price
    }
  }
`;
*/

const TRADES_QUERY = gql`
  query Trades($startBlock: BigInt!, $endBlock: BigInt!) {
    trades(first: 100000, where: {blockNumber_gte: $startBlock, blockNumber_lte: $endBlock}, orderBy: "timestamp", orderDirection: "desc") {
      id
      amountGet
      amountGive
      timestamp
    }
  }
`;

const PRICE_QUERY = gql`
  query Trades() {
    trades(first: 1, orderBy: "timestamp", orderDirection: "desc") {
      id
      price
    }
  }
`;

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrade(event: TradeEvent): void {
  let entity = new Trade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  let getValue: BigDecimal;
  let giveValue: BigDecimal;

  if(event.params.otype == new BigInt(0)){
     getValue = convertTokenToDecimal( event.params.amountGet, BI_6);
     giveValue = convertTokenToDecimal( event.params.amountGive, BI_18);
     entity.amountGet = getValue
     entity.amountGive = giveValue
     entity.otype = "Sell"
  } else if(event.params.otype == new BigInt(1)){
     getValue = convertTokenToDecimal( event.params.amountGet, BI_18);
     giveValue = convertTokenToDecimal( event.params.amountGive, BI_6);
     entity.amountGet = getValue
     entity.amountGive = giveValue
     entity.otype = "Buy"
  }
  let priceValue = convertTokenToDecimal( event.params.price, BI_3);

  entity.price = priceValue
  entity.userFill = event.params.userFill
  entity.userFilled = event.params.userFilled
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function get24hVolume(event : TradeEvent): BigDecimal {
  let now = event.block.number;
  let twentyFourHoursAgo = (now).minus(BigInt.fromI32(28800)); // 24 hours in blocks
  let volume = BigDecimal.fromString('0');

  const { data, loading, error } = useQuery<{ trades: Trade[] }, { startBlock: BigInt; endBlock: BigInt; }>(TRADES_QUERY, {
    variables: {
      startBlock: twentyFourHoursAgo,
      endBlock: now
    }
  } as QueryHookOptions<{ trades: Trade[] }, { startBlock: BigInt; endBlock: BigInt; }>);


  if (loading) return BigDecimal.fromString('0');
  if (error) return BigDecimal.fromString('0');
  if (!data) return BigDecimal.fromString('0');

  let trades = data.trades;

  for (let i = 0; i < trades.length; i++) {
    let trade = trades[i];
    if(trade.otype == '0'){
      volume = volume.plus(trade.amountGet);
    } else if(trade.otype == '1'){
      volume = volume.plus(trade.amountGive);
    }
  }

  return volume;
}

export function getLastPrice(): BigDecimal {

  const { data, loading, error } = useQuery<{ trades: Trade[] }>(PRICE_QUERY);

  if (loading) return BigDecimal.fromString('0');
  if (error) return BigDecimal.fromString('0');
  if (!data) return BigDecimal.fromString('0');

  let lastprice = data.trades[0].price;

  return lastprice;
}

export function getOrderbook(event : TradeEvent): [Array<[BigDecimal, BigDecimal]>, Array<[BigDecimal, BigDecimal]>] {
  let contract = OBXExchange.bind(event.address);
  let orderbook = contract.getPVobs();
  
  // 2 arrays (SELL and BUY) containing values of price and order size
  let sellside = orderbook.value0;
  let buyside = orderbook.value1;

  // order sellOB and buyOB by price
  let sellOB: Array<[BigDecimal, BigDecimal]> = [];
  let buyOB: Array<[BigDecimal, BigDecimal]> = [];
  
  for (let i = 0; i < sellside.length; i++) {
    if ((sellside[i][1]).gt(new ethereum.Value(0,0))) {
      let price = convertTokenToDecimal(sellside[i][0].toBigInt(),BI_3);
      let size = convertTokenToDecimal(sellside[i][1].toBigInt(),BI_18);
      sellOB.push([price, size]);
    }
  }
  for (let i = 0; i < buyside.length; i++) {
    if ((buyside[i][1]).gt(new ethereum.Value(0,0))) {
      let price = convertTokenToDecimal(buyside[i][0].toBigInt(),BI_3);
      let size = convertTokenToDecimal(buyside[i][1].toBigInt(),BI_18);
      buyOB.push([price, size]);
    }
  }

  return [sellOB, buyOB];
}

export function getSellOrders(event: TradeEvent): TypedMap<BigDecimal, BigDecimal> {
  let contract = OBXExchange.bind(event.address);
  let orderbook = contract.getPVobs();

  // arrays (SELL) containing values of price and order size
  let sellside = orderbook.value0;

  // order sellOB <price,size>
  let sellOB = new TypedMap<BigDecimal, BigDecimal>();

  for (let i = 0; i < sellside.length; i++) {
    if ((sellside[i][1]).gt(new ethereum.Value(0, 0))) {
      let priceInDecimals = convertTokenToDecimal(sellside[i][0].toBigInt(), BI_3);
      let sizeInDecimals = convertTokenToDecimal(sellside[i][1].toBigInt(), BI_18);
      sellOB.set(priceInDecimals, sizeInDecimals);
    }
  }

  return sellOB;

}

export function getBuyOrders(event: TradeEvent): TypedMap<BigDecimal, BigDecimal> {
  let contract = OBXExchange.bind(event.address);
  let orderbook = contract.getPVobs();

  // array (BUY) containing values of price and order size
  let buyside = orderbook.value1;

  // order sellOB and buyOB by price
  let buyOB = new TypedMap<BigDecimal, BigDecimal>();

  for (let i = 0; i < buyside.length; i++) {
    if ((buyside[i][1]).gt(new ethereum.Value(0, 0))) {
      let priceInDecimals = convertTokenToDecimal(buyside[i][0].toBigInt(), BI_3);
      let sizeInDecimals = convertTokenToDecimal(buyside[i][1].toBigInt(), BI_18);
      buyOB.set(priceInDecimals, sizeInDecimals);
    }
  }

  return buyOB;

}