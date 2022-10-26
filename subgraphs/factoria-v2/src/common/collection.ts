import { Address, ethereum } from "@graphprotocol/graph-ts"

import { BIGINT_ZERO } from './constants';

import { F0 } from '../../generated/Factoria/F0';
import { Collection as CollectionTemplate } from '../../generated/templates';
import { Collection } from '../../generated/schema';

export function createCollection(
  event: ethereum.Event,
  collectionAddress: Address,
  collectionOwnerAddress: Address
): Collection {
  const collectionContract = F0.bind(collectionAddress)
  const collection = new Collection(collectionAddress.toHex())

  const name = collectionContract.try_name()
  const symbol = collectionContract.try_symbol()

  collection.name = name.value
  collection.symbol = symbol.value
  collection.deployerId = event.transaction.from.toHex()
  collection.ownerId = collectionOwnerAddress.toHex()

  collection.tokenCount = BIGINT_ZERO
  collection.ownerCount = BIGINT_ZERO
  collection.transferCount = BIGINT_ZERO

  // Create and track the newly created collection contract based on the template specified in the subgraph.yaml file.
  CollectionTemplate.create(collectionAddress)

  collection.save()

  return collection
}