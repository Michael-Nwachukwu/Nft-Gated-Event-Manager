import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("Lock", function () {

    async function deployEntryNft() {
    
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();
    
        const NftContract = await hre.ethers.getContractFactory("Sliders");
        const nft = await NftContract.deploy(owner);
    
        return { nft, owner, otherAccount };

    }

    async function deployEventContract() {

        const { nft, owner, otherAccount } = await loadFixture(deployEntryNft);
    
        const EventContract = await hre.ethers.getContractFactory("EventContract");

        const event = await EventContract.deploy(nft);
    
        return { event, owner, otherAccount };
    }
  
    describe("Deployment", function () {

        it("Should set the right owner", async function () {

            const { event, owner, otherAccount } = await loadFixture(deployEventContract);

            expect(await event.owner()).to.equal(owner);
        });
    });
  
});
  