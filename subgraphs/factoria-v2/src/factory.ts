import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Factory as FactoryContract,
  CollectionAdded,
  OwnershipTransferred,
} from "../generated/Factoria/Factory"
import { F0 } from './../generated/Factoria/F0';

import { Collection, Factory } from './../generated/schema';

function createFactory(
  event: ethereum.Event,
  factoryAddress: Address
): Factory {
  const factoryContract = FactoryContract.bind(factoryAddress)
  const factory = new Factory(factoryAddress.toHexString())

  factory.collectionCount = BigInt.fromI32(0)

  factory.save()

  return factory
}

function createCollection(
  event: CollectionAdded,
  collectionAddress: Address,
  collectionOwnerAddress: Address
): Collection {
  const collectionContract = F0.bind(collectionAddress)
  const collection = new Collection(collectionAddress.toHexString())

  const name = collectionContract.try_name()
  const symbol = collectionContract.try_symbol()

  collection.name = name.reverted ? "" : name.value
  collection.symbol = symbol.reverted ? "" : symbol.value
  collection.deployerId = collectionOwnerAddress.toHexString()
  collection.ownerId = collectionOwnerAddress.toHexString()

  collection.save()

  return collection
}

export function handleCollectionAdded(event: CollectionAdded): void {
  // Factory

  const factoryAddreess = event.address

  let factory = Factory.load(factoryAddreess.toHexString())
  if (factory === null) {
    factory = createFactory(event, factoryAddreess)
  }

  factory.collectionCount = factory.collectionCount.plus(BigInt.fromI32(1))

  factory.save()

  // Collection

  const collectionAddress = event.params.collection
  const collectionOwnerAddress = event.params.receiver

  let collection = Collection.load(collectionAddress.toHexString())
  if (collection === null) {
    collection = createCollection(event, collectionAddress, collectionOwnerAddress)
  }

  collection.ownerId = collectionOwnerAddress.toHexString()

  collection.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
