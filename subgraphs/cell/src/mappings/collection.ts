import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import { C0, Transfer as TransferEvent, NSUpdated as NSUpdatedEvent } from '../../generated/Cell/C0';
import { Collection } from "../../generated/schema";

export function handleNSUpdated(event: NSUpdatedEvent): void {
  const collectionAddress = event.address;

  let collection = Collection.load(collectionAddress.toHex())
  if (collection == null) {
    log.critical('Collection not found!', [])
    return;
  }

  collection.name = event.params.name
  collection.symbol = event.params.symbol

  collection.save()
}