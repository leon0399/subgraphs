import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import { F0, Transfer as TransferEvent } from '../../generated/Factoria/F0';
import { Collection, Token } from "../../generated/schema";
import { BIGINT_ONE, GENESIS_ADDRESS } from "../common/constants";
import { createToken, getTokenId } from "../common/token";

export function handleTransfer(event: TransferEvent): void {
  const collectionAddress = event.address;
  const fromAddress = event.params.from;
  const toAddress = event.params.to;
  const tokenId = event.params.tokenId;
  const contract = F0.bind(collectionAddress)

  if (fromAddress.toHex() == GENESIS_ADDRESS && toAddress.toHex() == GENESIS_ADDRESS) {
    // skip if the transfer is from zero address to zero address
    return;
  }

  let collection = Collection.load(collectionAddress.toHex())
  if (collection == null) {
    log.critical('Collection not found!', [])
    return;
  }

  if (fromAddress.toHex() == GENESIS_ADDRESS) {
    // mint a new token
    collection.tokenCount = collection.tokenCount.plus(BIGINT_ONE)
  }

  if (toAddress.toHex() == GENESIS_ADDRESS) {
    // burn an existing token
    collection.tokenCount = collection.tokenCount.minus(BIGINT_ONE)
  }

  const tokenStoreId = getTokenId(collection, tokenId)
  let token = Token.load(tokenStoreId)
  if (token == null) {
    token = createToken(contract, collection, tokenId)
  }

  token.ownerId = toAddress.toHex()
  token.save()

  collection.transferCount = collection.transferCount.plus(BIGINT_ONE)
  collection.save()
}
