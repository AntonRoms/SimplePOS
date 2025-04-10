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

    function registerReceipt(string memory _receiptHash, string memory _companyName) public {
        uint256 newId = receipts.length;
        receipts.push(Receipt({
            id: newId,
            receiptHash: _receiptHash,
            companyName: _companyName,
            owner: msg.sender,
            timestamp: block.timestamp
        }));

        emit ReceiptRegistered(newId, _receiptHash, _companyName, msg.sender, block.timestamp);
    }

    function getReceipt(uint256 index) public view returns (
        uint256, string memory, string memory, address, uint256
    ) {
        require(index < receipts.length, "Invalid index");
        Receipt memory r = receipts[index];
        return (r.id, r.receiptHash, r.companyName, r.owner, r.timestamp);
    }
}
