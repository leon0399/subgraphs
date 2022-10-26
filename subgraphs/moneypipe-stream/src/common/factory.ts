import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Factory as FactoryContract,
} from "../../generated/Stream/Factory"

import { Factory } from '../../generated/schema';

export function createFactory(
  event: ethereum.Event,
  factoryAddress: Address
): Factory {
  const factoryContract = FactoryContract.bind(factoryAddress)
  const factory = new Factory(factoryAddress.toHex())

  factory.streamsCount = BigInt.fromI32(0)

  factory.save()

  return factory
}