import { BIGINT_ONE } from '../common/constants';

import { createFactory } from "../common/factory";
import { createStream } from "../common/stream";

import { ContractDeployed } from "../../generated/Stream/Factory"
import { Stream, Factory } from '../../generated/schema';

export function handleContractDeployed(event: ContractDeployed): void {
  // Factory

  const factoryAddreess = event.address

  let factory = Factory.load(factoryAddreess.toHex())
  if (factory == null) {
    factory = createFactory(event, factoryAddreess)
  }

  factory.streamsCount = factory.streamsCount.plus(BIGINT_ONE)

  factory.save()

  // Collection

  const streamAddress = event.params.group
  const streamOwnerAddress = event.params.owner

  let stream = Stream.load(streamAddress.toHex())
  if (stream == null) {
    stream = createStream(event, streamAddress, streamOwnerAddress)
  }

  stream.ownerId = streamOwnerAddress.toHex()

  stream.save()
}
