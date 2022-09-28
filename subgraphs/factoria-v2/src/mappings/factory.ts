import { BIGINT_ONE } from './../common/constants';

import { createFactory } from "../common/factory";
import { createCollection } from "../common/collection";

import {
  CollectionAdded,
} from "../../generated/Factoria/Factory"
import { Collection, Factory } from '../../generated/schema';

export function handleCollectionAdded(event: CollectionAdded): void {
  // Factory

  const factoryAddreess = event.address

  let factory = Factory.load(factoryAddreess.toHex())
  if (factory == null) {
    factory = createFactory(event, factoryAddreess)
  }

  factory.collectionCount = factory.collectionCount.plus(BIGINT_ONE)

  factory.save()

  // Collection

  const collectionAddress = event.params.collection
  const collectionOwnerAddress = event.params.receiver

  let collection = Collection.load(collectionAddress.toHex())
  if (collection == null) {
    collection = createCollection(event, collectionAddress, collectionOwnerAddress)
  }

  collection.ownerId = collectionOwnerAddress.toHex()

  collection.save()
}
