// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blockchain {
    struct Receipt {
        uint256 id;
        string receiptHash;
        string companyName;
        address owner;
        uint256 timestamp;
    }

    Receipt[] public receipts;

    event ReceiptRegistered(
        uint256 id,
        string receiptHash,
        string companyName,
        address indexed owner,
        uint256 timestamp
    );

    mapping(string => bool) private registeredHashes;

    function registerReceipt(string memory _receiptHash, string memory _companyName) public {
        require(!registeredHashes[_receiptHash], "Receipt already registered");

        uint256 newId = receipts.length;
        receipts.push(Receipt({
            id: newId,
            receiptHash: _receiptHash,
            companyName: _companyName,
            owner: msg.sender,
            timestamp: block.timestamp
        }));

        registeredHashes[_receiptHash] = true;

        emit ReceiptRegistered(newId, _receiptHash, _companyName, msg.sender, block.timestamp);
    }

    function verifyReceiptHash(string memory _receiptHash) public view returns (bool) {
        return registeredHashes[_receiptHash];
    }
}
