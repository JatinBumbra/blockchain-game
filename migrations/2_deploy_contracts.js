const Game = artifacts.require('Game');
const Token = artifacts.require('Token');

module.exports = async function (deployer) {
  // Deploy token and get deployed instance
  await deployer.deploy(Token);
  const token = await Token.deployed();
  // Deploy the game & pass token address to it (for future minting) and get deployed instance
  await deployer.deploy(Game, token.address);
  const game = await Game.deployed();
  // Make Game the minter for the token
  await token.passMinterRole(game.address);
};
