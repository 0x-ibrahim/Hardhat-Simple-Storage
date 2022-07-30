
const {ethers, run, network} = require("hardhat");

async function main() {

    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    )
    
    console.log("Deploying Contract")
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Deploy contract to: ${simpleStorage.address}`)
    // console.log(network.config)
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY){
      await simpleStorage.deployTransaction.wait(6)
      await verify(simpleStorage.address, [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`current value : $${currentValue}`)
    const transactionResponse =  await  simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is ${updatedValue}`)
}

async function verify(contractAddress, args){
  console.log("Verifying Contracts")
  try {
    await run("verify:Verify",
  {
    address: contractAddress,
    constructorArguments: args,
  })
}catch(e){
  if(e.message.toLowerCase().includes("already verified")){
    console.log("Already Verified!")
  }else {
    console.log(e)
  }
}
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
