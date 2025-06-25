const { ethers } = require("hardhat");

async function main() {
    // Compile the contracts (if not already compiled)
    await hre.run("compile");

    // Deploy the contract
    const Contract = await ethers.getContractFactory("EscrowFactory");
    const contract = await Contract.deploy(/* constructor arguments if any */);

    await contract.waitForDeployment();

    console.log("Contract deployed to:", contract.target);
}

// Execute the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//0xbd85D2B912E0091DD628fEa4ed6F657FB4183875