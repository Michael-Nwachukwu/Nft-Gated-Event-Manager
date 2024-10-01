import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventModule = buildModule("EventModule", (m) => {

  const nftAddress = "0x2C0457F82B57148e8363b4589bb3294b23AE7625";

  const event = m.contract("EventContract", [nftAddress]);

  return { event };
});

export default EventModule;