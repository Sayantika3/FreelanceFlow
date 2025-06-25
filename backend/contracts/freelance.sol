// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FreelanceEscrow {
    address public client;
    address public freelancer;
    address public agent;
    uint256 public amount;
    bool public isDeposited;
    bool public isCompleted;
    string public submissionLink;

    constructor(address _freelancer, address _client) {
        client = _client;
        freelancer = _freelancer;
    }

    function deposit() public payable {
        require(msg.sender == client, "Only client can deposit");
        require(!isDeposited, "Already deposited");
        require(msg.value > 0, "Must send ETH to deposit");

        amount = msg.value;
        isDeposited = true;
    }

    function releasePayment() public {
        require(isDeposited, "No deposit");
        require(!isCompleted, "Already paid");

        isCompleted = true;
        payable(freelancer).transfer(amount);
    }

    function refund() public {
        require(isDeposited && !isCompleted, "Cannot refund");
        isCompleted = true;
        payable(client).transfer(amount);
    }

    // ✅ New Function
    function submitWork(string calldata _link) public {
        require(msg.sender == freelancer, "Only freelancer can submit");
        require(bytes(_link).length > 0, "Link required");

        submissionLink = _link;
    }

    // Optional: getter for frontend (not required in Solidity >=0.5 for public vars)
    function getSubmissionLink() public view returns (string memory) {
        return submissionLink;
    }
}
contract EscrowFactory {
    address[] public jobs;

    event JobCreated(address contractAddress);

    function createJob(address _freelancer, address _client) public returns (address) {
        FreelanceEscrow job = new FreelanceEscrow(_freelancer, _client);
        jobs.push(address(job));
        emit JobCreated(address(job));
        return address(job);
    }

    
    function getAllJobs() public view returns (address[] memory) {
        return jobs;
    }
}