import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import { BIGINT_ZERO, GENESIS_ADDRESS } from './constants';

import { C0 } from '../../generated/Cell/C0';
import { Token, Collection } from '../../generated/schema';

export function getTokenId(collection: Collection, tokenId: BigInt): string {
  return `${collection.id}/${tokenId.toString()}`
}

export function createToken(
  contract: C0,
  collection: Collection,
  tokenId: BigInt
): Token {
  const tokenStoreId = getTokenId(collection, tokenId)

  const token = new Token(tokenStoreId)

  token.collection = collection.id
  token.tokenId = tokenId
  token.tokenURI = contract.tokenURI(tokenId)
  token.ownerId = GENESIS_ADDRESS

  token.save()

  return token
}