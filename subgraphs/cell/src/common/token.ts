import { ethereum, ipfs, json, BigInt, Bytes } from "@graphprotocol/graph-ts"

import { BIGINT_ZERO, GENESIS_ADDRESS } from './constants';

import { C0 } from '../../generated/Cell/C0';
import { Token, TokenMetadata, Collection } from '../../generated/schema';

export function getTokenId(collection: Collection, tokenId: BigInt): string {
  return `${collection.id}/${tokenId.toString()}`
}

export function createToken(event: ethereum.Event, contract: C0, collection: Collection, tokenId: BigInt): Token {
  const tokenStoreId = getTokenId(collection, tokenId)

  const token = new Token(tokenStoreId)

  token.collection = collection.id
  token.tokenId = tokenId
  token.tokenURI = contract.tokenURI(tokenId)
  token.ownerId = GENESIS_ADDRESS
  token.mintTime = event.block.timestamp
  token.mintValue = event.transaction.value
  token.transferCount = BIGINT_ZERO

  const tokenMetadata = updateTokenMetadata(token)
  if (tokenMetadata != null) {
    token.metadata = tokenMetadata.id
  }

  token.save()

  return token
}

function updateTokenMetadata(token: Token): TokenMetadata | null {
  if (token.tokenURI == null || !(token.tokenURI as String).startsWith('ipfs://')) {
    return null
  }

  const hash = (token.tokenURI as String).substring(7)
  const metadataBytes = ipfs.cat(hash)

  if (!metadataBytes) {
    return null
  }

  const metadataJson = json.fromBytes(metadataBytes as Bytes).toObject()

  if (metadataJson == null) {
    return null
  }

  const metadata = new TokenMetadata(hash)

  metadata.token = token.id

  const raw = metadataBytes.toString()
  if (raw != null) {
    metadata.raw = raw
  }

  const name = metadataJson.get('name')
  if (name != null) {
    metadata.name = name.toString()
  }

  const description = metadataJson.get('description')
  if (description != null) {
    metadata.description = description.toString()
  }

  const image = metadataJson.get('image')
  if (image != null) {
    metadata.image = image.toString()
  }

  metadata.save()

  return metadata
}