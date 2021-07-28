
const MultiSigWallet = artifacts.require("MultiSigWallet")
const Accounts = require("../Accounts");

// TODO testnet accounts
module.exports = function (deployer, network, accounts) {
  if (network === "main") {
    return
  }

  console.log("-----------------------------")
  console.log(process.env.INFURAKEY, Accounts)
  console.log("-----------------------------")

  const owners = network === "develop" ? accounts.slice(0, 3) : Accounts
  const numConfirmationsRequired = 2

  return deployer.deploy(MultiSigWallet, owners, numConfirmationsRequired)
}