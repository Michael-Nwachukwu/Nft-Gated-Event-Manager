# Event Management with NFT-based Registration

This project implements a smart contract system for event management with NFT-based registration. It consists of two main contracts: `EventContract` and `Sliders` (NFT).

## Contracts

### EventContract

The `EventContract` manages event creation, registration, and attendee tracking.

#### Key Features:
- Create events (owner only)
- Register for events (requires NFT ownership)
- View event attendees
- Check registration status
- List all events

#### Main Functions:
- `createEvent`: Create a new event (owner only)
- `registerForEvent`: Register for an event (requires NFT)
- `getAttendees`: Get list of attendees for an event
- `checkUserRegistration`: Check if a user is registered for an event
- `getEvents`: Get list of all events

### Sliders (NFT)

The `Sliders` contract is an ERC721 token used for event registration.

#### Key Features:
- Mint new NFTs
- ERC721 standard compliant

#### Main Functions:
- `mintNFT`: Mint a new NFT with a specified tokenURI

## Usage

1. Deploy the `Sliders` NFT contract
2. Deploy the `EventContract`, passing the `Sliders` contract address
3. Mint NFTs to users who should be able to register for events
4. Use `EventContract` to create and manage events

## Security Considerations

- Only the contract owner can create events
- Users must own at least one NFT to register for events
- Users can only register once per event
- Events have a duration and completion status

## Development

This project uses Solidity ^0.8.24 and OpenZeppelin contracts. Ensure you have the necessary development environment set up for Ethereum smart contract development.

## License

See LICENSE file for details.