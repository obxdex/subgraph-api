import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  Trade
} from "../generated/OBXExchange/OBXExchange"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTradeEvent(
  otype: BigInt,
  price: BigInt,
  amountGet: BigInt,
  amountGive: BigInt,
  userFill: Address,
  userFilled: Address,
  timestamp: BigInt
): Trade {
  let tradeEvent = changetype<Trade>(newMockEvent())

  tradeEvent.parameters = new Array()

  tradeEvent.parameters.push(
    new ethereum.EventParam("otype", ethereum.Value.fromUnsignedBigInt(otype))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "amountGet",
      ethereum.Value.fromUnsignedBigInt(amountGet)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "amountGive",
      ethereum.Value.fromUnsignedBigInt(amountGive)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("userFill", ethereum.Value.fromAddress(userFill))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "userFilled",
      ethereum.Value.fromAddress(userFilled)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return tradeEvent
}
