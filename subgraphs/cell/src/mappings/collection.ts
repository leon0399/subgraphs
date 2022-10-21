import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import { C0, Transfer as TransferEvent, NSUpdated as NSUpdatedEvent } from '../../generated/Cell/C0';
import { Transfer, Collection, Token } from "../../generated/schema";
import { getOrCreateAccountBalance } from "../common/account";
import { BIGINT_ONE, BIGINT_ZERO, GENESIS_ADDRESS } from "../common/constants";
import { createToken, getTokenId } from "../common/token";

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

export function handleTransfer(event: TransferEvent): void {
  const collectionAddress = event.address;
  const fromAddress = event.params.from;
  const toAddress = event.params.to;
  const tokenId = event.params.tokenId;
  const contract = C0.bind(collectionAddress)

  if (fromAddress.toHex() == GENESIS_ADDRESS && toAddress.toHex() == GENESIS_ADDRESS) {
    // skip if the transfer is from zero address to zero address
    return;
  }

  let collection = Collection.load(collectionAddress.toHex())
  if (collection == null) {
    log.critical('Collection not found!', [])
    return;
  }

  // update metrics on the sender side
  if (fromAddress.toHex() == GENESIS_ADDRESS) {
    // mint a new token
    collection.tokenCount = collection.tokenCount.plus(BIGINT_ONE)
  } else {
    const currentAccountBalance = getOrCreateAccountBalance(fromAddress.toHex(), collectionAddress.toHex())
    currentAccountBalance.tokenCount = currentAccountBalance.tokenCount.minus(BIGINT_ONE)
    currentAccountBalance.blockNumber = event.block.number
    currentAccountBalance.timestamp = event.block.timestamp
    currentAccountBalance.save()

    if (currentAccountBalance.tokenCount.equals(BIGINT_ZERO)) {
      collection.ownerCount = collection.ownerCount.minus(BIGINT_ONE)
    }
  }

  // update metrics on the receiver side
  if (toAddress.toHex() == GENESIS_ADDRESS) {
    // burn an existing token
    collection.tokenCount = collection.tokenCount.minus(BIGINT_ONE)
  } else {
    const newAccountBalance = getOrCreateAccountBalance(toAddress.toHex(), collectionAddress.toHex())
    newAccountBalance.tokenCount = newAccountBalance.tokenCount.plus(BIGINT_ONE)
    newAccountBalance.blockNumber = event.block.number
    newAccountBalance.timestamp = event.block.timestamp
    newAccountBalance.save()

    if (newAccountBalance.tokenCount.equals(BIGINT_ONE)) {
      collection.ownerCount = collection.ownerCount.plus(BIGINT_ONE);
    }
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

function createTransfer(event: TransferEvent): Transfer {
  const collectionId = event.address.toHex()
  const transactionHash = event.transaction.hash.toHex()
  const logIndex = event.logIndex

  const transferId = `${collectionId}/${transactionHash}/${logIndex.toString()}`
  const transfer = new Transfer(transferId)

  transfer.hash = transactionHash
  transfer.logIndex = logIndex.toI32()
  transfer.collection = collectionId
  transfer.nonce = event.transaction.nonce.toI32()
  transfer.tokenId = event.params.tokenId
  transfer.from = event.params.from.toHex()
  transfer.to = event.params.to.toHex()
  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp

  return transfer
}
