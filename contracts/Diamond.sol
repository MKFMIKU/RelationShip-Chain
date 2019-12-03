pragma solidity >=0.4.21 <0.6.0;

contract Diamond {
    address public owner;
    bytes32 public boy;
    bytes32 public girl;
    bytes32 public date;
    uint public status;
    bytes public image;
    bytes public description;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function createDiamond(bytes32 boyEntry, bytes32 girlEntry, bytes32 dateEntry, uint statusEntry, bytes memory imageEntry, bytes memory descriptionEntry) public{
        boy = boyEntry;
        girl = girlEntry;
        date = dateEntry;
        status = statusEntry;
        image = imageEntry;
        description = descriptionEntry;

        emit MajorEvent(boy, girl, date, status, image);
     }


    event MajorEvent(bytes32 indexed boy, bytes32 indexed girl, bytes32 date, uint status, bytes image);

    function () external{
        revert("Error in provided data");
    }
}