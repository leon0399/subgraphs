import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Factory as FactoryContract,
} from "../../generated/Cell/Factory"

import { Factory } from '../../generated/schema';

export function createFactory(
  call: ethereum.Call,
  factoryAddress: Address
): Factory {
  const factoryContract = FactoryContract.bind(factoryAddress)
  const factory = new Factory(factoryAddress.toHex())

  factory.collectionCount = BigInt.fromI32(0)

  factory.save()

  return factory
}