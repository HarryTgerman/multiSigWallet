
const MultiSigWallet = artifacts.require("MultiSigWallet")
const Accounts = require("../Accounts");

// TODO testnet accounts
module.exports = function (deployer, network, accounts) {
  if (network === "main") {
    return
  }

  console.log("-----------------------------")
  console.log(network, "network", accounts)
  console.log("-----------------------------")

  const owners = network === "development" ? accounts.slice(0, 3) : process.env.ACCOUNTS
  const numConfirmationsRequired = 2

  return deployer.deploy(MultiSigWallet, owners, numConfirmationsRequired)
}