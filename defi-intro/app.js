require("dotenv").config();
// Configure Web3
const Web3 = require("web3");
const web3 = new Web3(`https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`);
const account = process.env.ACCOUNT_PUBLIC_KEY;
web3.eth.accounts.wallet.add(process.env.ACCOUNT_PRIVATE_KEY);

const daiData = require("./contracts/dai");
const dai = new web3.eth.Contract(daiData.abi, daiData.address);

run = async () => {
  let result;

  // Check Ether balance
  result = await web3.eth.getBalance(account);
  result = web3.utils.fromWei(result, "Ether");
  console.log("Ether Balance:", result.toString());

  // Check Dai balance
  result = await dai.methods.balanceOf(account).call();
  result = web3.utils.fromWei(result, "Ether");
  console.log("Dai Balance:", result);

  // Trasnfer DAI to a random account
  let to = "0xe16E1456F3172fa5B3a2D7f49321601767d36DCA";
  let amount = web3.utils.toWei("1", "Ether"); // 1 DAI
  result = await dai.methods.transfer(to, amount).send({
    from: account,
    gasLimit: 6000000,
    gasPrice: web3.utils.toWei("50", "Gwei"),
  });
  console.log(`Successful tx: https://rinkeby.etherscan.io/tx/${result.transactionHash}`);

  // Check Ether balance
  result = await web3.eth.getBalance(account);
  result = web3.utils.fromWei(result, "Ether");
  console.log("Ether Balance:", result.toString());

  // Check Dai balance
  result = await dai.methods.balanceOf(account).call();
  result = web3.utils.fromWei(result, "Ether");
  console.log("Dai Balance:", result);
};
run();
