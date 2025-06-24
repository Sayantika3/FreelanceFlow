// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FreelanceEscrow {
    address public client;
    address public freelancer;
    address public agent;
    uint256 public amount;
    bool public isDeposited;
    bool public isCompleted;

    constructor( address _freelancer, address _agent) {
        client = msg.sender;
        freelancer = _freelancer;
        agent = _agent;
    }

    function deposit() public payable {
        require(msg.sender == client, "Only client can deposit");
        require(!isDeposited, "Already deposited");
        amount = msg.value;
        isDeposited = true;
    }

    function releasePayment() public {
        require(msg.sender == agent, "Only agent can approve");
        require(isDeposited, "No deposit");
        require(!isCompleted, "Already paid");

        isCompleted = true;
        payable(freelancer).transfer(amount);
    }

    function refund() public {
        require(msg.sender == agent, "Only agent can refund");
        require(isDeposited && !isCompleted, "Cannot refund");
        isCompleted = true;
        payable(client).transfer(amount);
    }
}
contract EscrowFactory {
    address[] public jobs;

    event JobCreated(address contractAddress);

    function createJob( address _freelancer, address _agent) public {
        FreelanceEscrow job = new FreelanceEscrow( _freelancer, _agent);
        jobs.push(address(job));
        emit JobCreated(address(job));
    }

    function getAllJobs() public view returns (address[] memory) {
        return jobs;
    }
}