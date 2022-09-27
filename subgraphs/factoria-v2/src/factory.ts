import { type Address, BigInt } from "@graphprotocol/graph-ts"

import {
  CollectionAdded,
  OwnershipTransferred,
} from "../generated/Factoria/Factory"
import { F0 } from './../generated/Factoria/F0';

import { Collection } from './../generated/schema';

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

  collection.save()

  return collection
}

export function handleCollectionAdded(event: CollectionAdded): void {
  const collectionAddress = event.params.collection
  const collectionOwnerAddress = event.params.receiver

  const collection = Collection.load(collectionAddress.toHexString()) || createCollection(event, collectionAddress, collectionOwnerAddress)

  collection.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
