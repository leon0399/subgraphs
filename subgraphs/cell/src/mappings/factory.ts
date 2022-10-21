import { BIGINT_ONE } from './../common/constants';

import { createFactory } from '../common/factory'

import { GenesisCall } from './../../generated/Cell/Factory'
import { Collection, Factory } from '../../generated/schema'
import { createCollection } from '../common/collection';

export function handleGenesis(call: GenesisCall): void {
  // Factory

  const factoryAddreess = call.to

  let factory = Factory.load(factoryAddreess.toHex())
  if (factory == null) {
    factory = createFactory(call, factoryAddreess)
  }

  factory.collectionCount = factory.collectionCount.plus(BIGINT_ONE)

  factory.save()

  // Collection

  const collectionAddress = call.outputs.value0
  const collectionOwnerAddress = call.from

  let collection = Collection.load(collectionAddress.toHex())
  if (collection == null) {
    collection = createCollection(call, collectionAddress, collectionOwnerAddress)
  }

  collection.ownerId = collectionOwnerAddress.toHex()

  collection.save()
}