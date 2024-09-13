// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Name {
    address owner;
    IERC721 requiredNftAddress;
    uint256 eventCount;

    constructor(address _requiredNftAddress) {
        owner = msg.sender;
        requiredNftAddress = IERC721(_requiredNftAddress);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can call function");
        _;
    }

    struct Event {
        uint256 id;
        string eventName;
        uint256 eventDate;
        uint256 duration;
        uint256 endDate;
        uint256 attendees;
        string[] speakers;
        string eventLocationName;
        bool isCompleted;
    }

    mapping (uint256 => Event) public events;
    mapping (address => mapping (uint256 => bool)) public hasRegistered;
    mapping (uint256 => address[]) registeredAddresses;

    event EventCreated();

    function createEvent(string memory _eventName, uint256 _eventDate, string[] memory _speakers, string memory  _locationName ) external onlyOwner {
        
        require(msg.sender != address(0), "Invalid input");
        require(bytes(_eventName).length > 0, "Title cant be empty");
        require(bytes(_locationName).length > 0, "Location cant be empty");
        require(_eventDate > block.timestamp);

        uint256 _eventId = eventCount + 1;

        Event storage _event = events[_eventId];

        _event.id = _eventId;
        _event.eventName = _eventName;
        _event.eventDate = _eventDate;
        _event.duration = 3 days;
        _event.endDate = block.timestamp + _event.duration;
        _event.speakers = _speakers;
        _event.eventLocationName = _locationName;

        eventCount++;

        emit EventCreated();

    }

    // 0x9d6e23b6B029BEaC49C43679304D32fDBf88F42A
    // ["kemi", "samson", "michael", "levi"]

    function registerForEvent(uint256 _eventId) external {
        require(msg.sender != address(0), "Invalid input");
        Event storage _event = events[_eventId];
        require(_eventId > 0, "Invalid input");
        require(_event.isCompleted == false, "Event completed");
        require(_event.endDate > block.timestamp, "Event duration has elapsed");
        require(!hasRegistered[msg.sender][_eventId], "Already Registered");
        require(IERC721(requiredNftAddress).balanceOf(msg.sender) > 0, "Must hold at least one NFT to register");

        _event.attendees += 1;
        hasRegistered[msg.sender][_eventId] = true;
        registeredAddresses[_eventId].push(msg.sender);
    }

    function getAttendees(uint256 _eventId) external view returns (address[] memory) {
        return registeredAddresses[_eventId];
    }

    function checkUserRegistration(uint256 _eventId) external view returns (bool) {
        return hasRegistered[msg.sender][_eventId];
    }

    function getEvents() external view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](eventCount);
        for(uint256 i = 1; i <= eventCount; i++) {
            allEvents[i-1] = events[i];
        }
        return allEvents;
    }
}