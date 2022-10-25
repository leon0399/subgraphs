import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import { BIGINT_ZERO, GENESIS_ADDRESS } from './constants';

import { F0 } from '../../generated/Factoria/F0';
import { Token, Collection } from '../../generated/schema';

export function getTokenId(collection: Collection, tokenId: BigInt): string {
  return `${collection.id}/${tokenId.toString()}`
}

export function createToken(
  event: ethereum.Event,
  contract: F0,
  collection: Collection,
  tokenId: BigInt
): Token {
  const tokenStoreId = getTokenId(collection, tokenId)

  const token = new Token(tokenStoreId)

  token.collection = collection.id
  token.tokenId = tokenId
  token.tokenURI = contract.tokenURI(tokenId)
  token.ownerId = GENESIS_ADDRESS
  token.transferCount = BIGINT_ZERO
  token.mintTime = event.block.timestamp
  token.mintValue = event.transaction.value

  token.save()

  return token
}