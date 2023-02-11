// import { gql, createClient, useQuery } from 'urql';

import {
  OBXExchange,
  Trade as TradeEvent
} from "../generated/OBXExchange/OBXExchange"
import { Trade, Info, DayVolume } from "../generated/schema"
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
  let lastTrade = BigInt.fromI32(0);
  let infoEntity = Info.load("01")
  if (infoEntity == null) {
    infoEntity = new Info("01");
    infoEntity.lastTrackedBlock = BigInt.fromI32(38498660);
    infoEntity.lastTrade = BigInt.fromI32(0);
    infoEntity.lastTrackedTrade = BigInt.fromI32(0);
    infoEntity.lastPrice = ZERO_BD;
    infoEntity.last24HourVolume = ZERO_BD;
    infoEntity.trackedDay = BigInt.fromI32(0);
    infoEntity.save();
  } else{
    lastTrade = infoEntity.lastTrade.plus(BigInt.fromI32(1));
  }

  let entity = new Trade(
   lastTrade.toString()  
  )

  let getValue: BigDecimal;
  let giveValue: BigDecimal;


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
  infoEntity.lastPrice = priceValue;
  infoEntity.lastTrade = lastTrade;
  infoEntity.save()

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
   
  let infoEntity = Info.load("01");
  
  if (infoEntity == null) {
    infoEntity = new Info("01");
    infoEntity.lastTrackedBlock = BigInt.fromI32(38498660);
    infoEntity.lastTrade = BigInt.fromI32(0);
    infoEntity.lastTrackedTrade = BigInt.fromI32(0);
    infoEntity.lastPrice = ZERO_BD;
    infoEntity.last24HourVolume = ZERO_BD;
    infoEntity.trackedDay = BigInt.fromI32(0);
    infoEntity.save();
  }
  
  let totalVolume = ZERO_BD;

  let tradeEntities: Trade[] = [];


  if(block.number >= infoEntity.lastTrackedBlock.plus(BigInt.fromI32(28800))){

    if(infoEntity.lastTrackedTrade != infoEntity.lastTrade){
      for (let i = infoEntity.lastTrackedTrade; i <= infoEntity.lastTrade; i = i.plus(BigInt.fromI32(1))) {
        
        let numberId = i.toString();
        let tradeEntity = Trade.load(numberId);
    
        if (tradeEntity != null) {
          tradeEntities.push(tradeEntity);
        }

      }
      
      totalVolume = tradeEntities.reduce((acc, tradeEntity) => acc.plus(tradeEntity.volumeInQuote), ZERO_BD);

      infoEntity.last24HourVolume = totalVolume;
      infoEntity.lastTrackedTrade = infoEntity.lastTrade;
      infoEntity.lastTrackedBlock = block.number;

    } else{
      infoEntity.last24HourVolume = ZERO_BD;
      infoEntity.lastTrackedTrade = infoEntity.lastTrade;
      infoEntity.lastTrackedBlock = block.number;
    }
      
      
      let trackedDay = infoEntity.trackedDay.plus(BigInt.fromI32(1));
      let volumesEntity = new DayVolume(block.hash)
      volumesEntity.dayNumber = trackedDay
      volumesEntity.volume24hours = totalVolume;
      volumesEntity.save();

      
    infoEntity.trackedDay = trackedDay;

    infoEntity.save();

  }
 
}
