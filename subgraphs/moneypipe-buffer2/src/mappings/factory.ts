import { BIGINT_ONE } from '../common/constants';

import { createFactory } from "../common/factory";
import { createBuffer } from "../common/buffer";

import { ContractDeployed } from "../../generated/Stream/Factory"
import { Buffer, Factory } from '../../generated/schema';

export function handleContractDeployed(event: ContractDeployed): void {
  // Factory

  const factoryAddreess = event.address

  let factory = Factory.load(factoryAddreess.toHex())
  if (factory == null) {
    factory = createFactory(event, factoryAddreess)
  }

  factory.buffersCount = factory.buffersCount.plus(BIGINT_ONE)

  factory.save()

  // Collection

  const streamAddress = event.params.group
  const streamOwnerAddress = event.params.deployer

  let buffer = Buffer.load(streamAddress.toHex())
  if (buffer == null) {
    buffer = createBuffer(event, streamAddress, streamOwnerAddress)
  }

  buffer.ownerId = streamOwnerAddress.toHex()

  buffer.save()
}
