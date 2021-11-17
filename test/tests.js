const { expect } = require('chai');

const Game = artifacts.require('Game');
const Token = artifacts.require('Token');

require('chai').use(require('chai-as-promised')).should();

const fromEtherToWei = (wei) => web3.utils.toWei(wei);

contract('Game', ([deployer, player]) => {
  let game, token;

  before(async () => {
    token = await Token.new();
    game = await Game.new(token.address);
    // Make game the minter for token
    await token.passMinterRole(game.address, { from: deployer });
  });

  describe('Token Contract', () => {
    describe('attributes', () => {
      it('has correct name', async () => {
        const name = await token.name();
        expect(name.toString()).equal('Kitty Token');
      });
      it('has correct symbol', async () => {
        const symbol = await token.symbol();
        expect(symbol.toString()).equal('KIT');
      });
    });
  });

  describe('issueRewards()', () => {
    beforeEach(async () => {
      await game.issueRewards(fromEtherToWei('10'), { from: player });
    });

    it('tranfers reward points to the user', async () => {
      const rewards = await token.balanceOf(player);

      expect(rewards.toString()).equal(fromEtherToWei('10'));
    });
  });
});
