import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Stream } from "../../generated/schema";
import { ContractDeployed } from "../../generated/Stream/Factory";

export function createStream(
  event: ContractDeployed,
  streamAddress: Address,
  streamOwnerAddress: Address
): Stream {
  const stream = new Stream(streamAddress.toHex())

  stream.title = event.params.title
  stream.deployerId = event.transaction.from.toHex()
  stream.ownerId = streamOwnerAddress.toHex()

  stream.save()

  return stream
}