import {
    loadFixture,
    time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EventContract", function () {
    async function deployEntryNft() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const NftContract = await hre.ethers.getContractFactory("Sliders");
        const nft = await NftContract.deploy(owner);
        return { nft, owner, otherAccount };
    }

    async function deployEventContract() {
        const { nft, owner, otherAccount } = await loadFixture(deployEntryNft);
        const EventContract = await hre.ethers.getContractFactory("EventContract");
        const event = await EventContract.deploy(await nft.getAddress());
        return { event, nft, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { event, owner } = await loadFixture(deployEventContract);
            expect(await event.owner()).to.equal(owner.address);
        });

        it("Should set the right NFT address", async function () {
            const { event, nft } = await loadFixture(deployEventContract);
            const nftAddress = await nft.getAddress();
            const eventNftAddress = await event.requiredNftAddress();
            expect(eventNftAddress).to.equal(nftAddress);
        });
    });

    describe("Events", function () {

        describe("Validations", function () {

            it("Should revert with 'Title cant be empty' ", async function () {
                const { event } = await loadFixture(deployEventContract);
    
                const eventName = "";
                const eventDate = 1726780800;
                const speakers = [
                    "Kevin", 
                    "Jordan"
                ];
                const locationName = "The zone";
                const duration = 259200;
    
                await expect(event.createEvent(eventName, eventDate, speakers, locationName, duration)).to.be.revertedWith("Title cant be empty");
            });

            it("Should revert with 'Location cant be empty' ", async function () {
                const { event } = await loadFixture(deployEventContract);
    
                const eventName = "Field day with chi";
                const eventDate = 1726780800;
                const speakers = [
                    "faves", 
                    "nappy"
                ];
                const locationName = "";
                const duration = 259200;
    
                await expect(event.createEvent(eventName, eventDate, speakers, locationName, duration)).to.be.revertedWith("Location cant be empty");
            });

            it("Should revert with 'Date must be future' ", async function () {
                const { event } = await loadFixture(deployEventContract);
    
                const eventName = "Field day with chi";
                const eventDate = 1726358400;
                const speakers = [
                    "faves", 
                    "nappy"
                ];
                const locationName = "The zone";
                const duration = 259200;
    
                await expect(event.createEvent(eventName, eventDate, speakers, locationName, duration)).to.be.revertedWith("Date must be future");
            });
        });

        describe("Confirmations", function () {
            it("Should create new event by owner", async function () {
                const { event } = await loadFixture(deployEventContract);
    
                const eventName = "Comicon";
                const eventDate = 1726780800;
                const speakers = [
                    "Kevin", 
                    "Jordan"
                ];
                const locationName = "The zone";
                const duration = 259200;
    
                await event.createEvent(eventName, eventDate, speakers, locationName, duration);
                expect(await event.eventCount()).to.equal(1);
            });

            it("Should create new event by owner", async function () {
                const { event } = await loadFixture(deployEventContract);
    
                const eventName = "Comicon";
                const eventDate = 1726780800;
                const speakers = [
                    "Kevin", 
                    "Jordan"
                ];
                const locationName = "The zone";
                const duration = 259200;
    
                await event.createEvent(eventName, eventDate, speakers, locationName, duration);

                // Get the current block
                const currentTimestamp = await time.latest();
                const endDate = currentTimestamp + duration;

                const _event = await event.events(1);

            
                expect(_event.id).to.equal(1);
                expect(_event.eventName).to.equal(eventName);
                expect(_event.duration).to.equal(duration);
                expect(_event.endDate).to.equal(endDate);
                expect(_event.attendees).to.equal(0);
                expect(_event.isCompleted).to.be.false;
                // expect(_event.speakers.length).to.equal(2);
                expect(_event.eventLocationName).to.equal(locationName);
            });
        });

        // describe("Validations", function () {
        //     this.beforeEach(async function () {
        //         const { event } = await loadFixture(deployEventContract);
    
        //         const eventName = "Comicon";
        //         const eventDate = 1726780800;
        //         const speakers = [
        //             "Kevin", 
        //             "Jordan"
        //         ];
        //         const locationName = "The zone";
        //         const duration = 259200;
    
        //         await event.createEvent(eventName, eventDate, speakers, locationName, duration);
        //     })
        //     it("Should revert with 'Invalid input' for invalid event id", async function () {
        //         const { event } = await loadFixture(deployEventContract);

        //         expect(await event.registerForEvent(0)).to.be.revertedWith("Invalid input");
        //     });

        //     it("Should revert with 'Invalid input' for invalid event id", async function () {
        //         const { event } = await loadFixture(deployEventContract);

        //         await event.registerForEvent(1);

        //         expect(await event.registerForEvent(1)).to.be.revertedWith("Invalid input");
        //     });
        // })

        describe("Validations", function () {
            beforeEach(async function () {
              const { event } = await loadFixture(deployEventContract);
              
              const eventName = "Comicon";
              const eventDate = 1726780800;
              const speakers = ["Kevin", "Jordan"];
              const locationName = "The zone";
              const duration = 259200;
              
              await event.createEvent(eventName, eventDate, speakers, locationName, duration); 
            });
      
            it("Should revert with 'Invalid input' for invalid event id", async function () {
              const { event } = await loadFixture(deployEventContract);
              
              await expect(event.registerForEvent(0))
                .to.be.revertedWith("Invalid input");
            });
      
            it("Should revert with 'Already Registered' for double registration", async function () {
              const { event } = await loadFixture(deployEventContract);
              
              await event.registerForEvent(1);
      
              await expect(event.registerForEvent(1))
                .to.be.revertedWith("Event duration has elapsed");
            });
        });
    });
});