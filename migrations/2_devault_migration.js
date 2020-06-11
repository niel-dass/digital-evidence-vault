const devault = artifacts.require("./Devault.sol");

module.exports = function(deployer) {
  deployer.deploy(devault);
};
