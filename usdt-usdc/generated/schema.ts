// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Trade extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Trade entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Trade must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Trade", id.toString(), this);
    }
  }

  static load(id: string): Trade | null {
    return changetype<Trade | null>(store.get("Trade", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get otype(): string {
    let value = this.get("otype");
    return value!.toString();
  }

  set otype(value: string) {
    this.set("otype", Value.fromString(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value!.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }

  get amountGet(): BigDecimal {
    let value = this.get("amountGet");
    return value!.toBigDecimal();
  }

  set amountGet(value: BigDecimal) {
    this.set("amountGet", Value.fromBigDecimal(value));
  }

  get amountGive(): BigDecimal {
    let value = this.get("amountGive");
    return value!.toBigDecimal();
  }

  set amountGive(value: BigDecimal) {
    this.set("amountGive", Value.fromBigDecimal(value));
  }

  get userFill(): Bytes {
    let value = this.get("userFill");
    return value!.toBytes();
  }

  set userFill(value: Bytes) {
    this.set("userFill", Value.fromBytes(value));
  }

  get userFilled(): Bytes {
    let value = this.get("userFilled");
    return value!.toBytes();
  }

  set userFilled(value: Bytes) {
    this.set("userFilled", Value.fromBytes(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get volumeInQuote(): BigDecimal {
    let value = this.get("volumeInQuote");
    return value!.toBigDecimal();
  }

  set volumeInQuote(value: BigDecimal) {
    this.set("volumeInQuote", Value.fromBigDecimal(value));
  }
}

export class Info extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Info entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Info must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Info", id.toString(), this);
    }
  }

  static load(id: string): Info | null {
    return changetype<Info | null>(store.get("Info", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get lastPrice(): BigDecimal {
    let value = this.get("lastPrice");
    return value!.toBigDecimal();
  }

  set lastPrice(value: BigDecimal) {
    this.set("lastPrice", Value.fromBigDecimal(value));
  }

  get last24HourVolume(): BigDecimal {
    let value = this.get("last24HourVolume");
    return value!.toBigDecimal();
  }

  set last24HourVolume(value: BigDecimal) {
    this.set("last24HourVolume", Value.fromBigDecimal(value));
  }

  get lastTrackedBlock(): BigInt {
    let value = this.get("lastTrackedBlock");
    return value!.toBigInt();
  }

  set lastTrackedBlock(value: BigInt) {
    this.set("lastTrackedBlock", Value.fromBigInt(value));
  }

  get lastTrackedTrade(): BigInt {
    let value = this.get("lastTrackedTrade");
    return value!.toBigInt();
  }

  set lastTrackedTrade(value: BigInt) {
    this.set("lastTrackedTrade", Value.fromBigInt(value));
  }

  get lastTrade(): BigInt {
    let value = this.get("lastTrade");
    return value!.toBigInt();
  }

  set lastTrade(value: BigInt) {
    this.set("lastTrade", Value.fromBigInt(value));
  }

  get trackedDay(): BigInt {
    let value = this.get("trackedDay");
    return value!.toBigInt();
  }

  set trackedDay(value: BigInt) {
    this.set("trackedDay", Value.fromBigInt(value));
  }
}

export class DayVolume extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DayVolume entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type DayVolume must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("DayVolume", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): DayVolume | null {
    return changetype<DayVolume | null>(
      store.get("DayVolume", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get dayNumber(): BigInt | null {
    let value = this.get("dayNumber");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set dayNumber(value: BigInt | null) {
    if (!value) {
      this.unset("dayNumber");
    } else {
      this.set("dayNumber", Value.fromBigInt(<BigInt>value));
    }
  }

  get volume24hours(): BigDecimal | null {
    let value = this.get("volume24hours");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set volume24hours(value: BigDecimal | null) {
    if (!value) {
      this.unset("volume24hours");
    } else {
      this.set("volume24hours", Value.fromBigDecimal(<BigDecimal>value));
    }
  }
}