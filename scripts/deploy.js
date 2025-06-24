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
//0xc7c953d28f0ADf7C72a1fD41902315b73CD44991