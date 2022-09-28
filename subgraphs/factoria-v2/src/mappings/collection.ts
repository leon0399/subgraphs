import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import { F0, Transfer } from '../../generated/Factoria/F0';
import { Collection } from "../../generated/schema";
import { BIGINT_ONE, GENESIS_ADDRESS } from "../common/constants";

export function handleTransfer(event: Transfer): void {
  const collectionAddress = event.address;
  const fromAddress = event.params.from;
  const toAddress = event.params.to;
  const tokenId = event.params.tokenId;

  log.info("Collection: {}, tx: {}, from: {}, to: {}", [collectionAddress.toHex(), event.transaction.hash.toHex(), fromAddress.toHex(), toAddress.toHex()])

  let collection = Collection.load(collectionAddress.toHex())

  if (collection == null) {
    log.critical('Collection not found!', [])
    return;
  }

  if (fromAddress.toHex() == GENESIS_ADDRESS) {
    // mint a new token
    collection.tokenCount = collection.tokenCount.plus(BIGINT_ONE)
  }

  collection.transferCount = collection.transferCount.plus(BIGINT_ONE)

  collection.save()
}
