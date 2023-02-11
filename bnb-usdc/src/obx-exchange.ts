// import { gql, createClient, useQuery } from 'urql';

import {
  OBXExchange,
  Trade as TradeEvent
} from "../generated/OBXExchange/OBXExchange"
import { Trade, LastPrice, DayVolume } from "../generated/schema"
import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts/index'
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

export function handleTrade(event: TradeEvent): void {

  let entity = new Trade(
    event.block.number.toString()
  )

  let getValue: BigDecimal;
  let giveValue: BigDecimal;

  let priceEntity = LastPrice.load("01")
  if (priceEntity == null) {
    priceEntity = new LastPrice("01")
  }


  if (event.params.otype == BigInt.fromI32(0)) {
    getValue = convertTokenToDecimal(event.params.amountGet, BI_18);
    giveValue = convertTokenToDecimal(event.params.amountGive, BI_18);
    entity.amountGet = getValue
    entity.amountGive = giveValue
    entity.otype = "Sell"

    entity.volumeInQuote = convertTokenToDecimal(event.params.amountGet, BI_18);

  } else if (event.params.otype == BigInt.fromI32(1)) {
    getValue = convertTokenToDecimal(event.params.amountGet, BI_18);
    giveValue = convertTokenToDecimal(event.params.amountGive, BI_18);
    entity.amountGet = getValue
    entity.amountGive = giveValue
    entity.otype = "Buy"

    entity.volumeInQuote = convertTokenToDecimal(event.params.amountGive, BI_18);
  }

  let priceValue = convertTokenToDecimal(event.params.price, BI_3);

  //Last Price Entity Update
  priceEntity.price = priceValue;

  priceEntity.save()

  entity.price = priceValue
  entity.userFill = event.params.userFill
  entity.userFilled = event.params.userFilled
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()


}


export function handleBlock(block: ethereum.Block): void {
  let volumeEntity = DayVolume.load("02");
  
  if (volumeEntity == null) {
    volumeEntity = new DayVolume("02");
    volumeEntity.trackedBlock = BigInt.fromI32(0);
  }
  
  let totalVolume = ZERO_BD;
  

    let tradeEntities: Trade[] = [];

    for (let i = block.number.minus(BigInt.fromI32(28800)); i <= block.number; i = i.plus(BigInt.fromI32(1))) {
      let numberId = i.toString();
      let tradeEntity = Trade.load(numberId);

      if (tradeEntity !== null) {
        tradeEntities.push(tradeEntity);
      }
    }

  totalVolume = tradeEntities.reduce((acc, tradeEntity) => acc.plus(tradeEntity.volumeInQuote), ZERO_BD);
  

  volumeEntity.trackedBlock = block.number;
  volumeEntity.volumeInQuote = totalVolume;
  volumeEntity.save();
  
}