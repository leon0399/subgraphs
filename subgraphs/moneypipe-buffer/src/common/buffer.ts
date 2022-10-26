import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Buffer } from "../../generated/schema";
import { ContractDeployed } from "../../generated/Stream/Factory";

export function createStream(
  event: ContractDeployed,
  streamAddress: Address,
  streamOwnerAddress: Address
): Buffer {
  const buffer = new Buffer(streamAddress.toHex())

  buffer.title = event.params.title
  buffer.deployerId = event.transaction.from.toHex()
  buffer.ownerId = streamOwnerAddress.toHex()

  buffer.save()

  return buffer
}