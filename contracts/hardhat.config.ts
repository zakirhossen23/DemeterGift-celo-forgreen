import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
dotenv.config();

module.exports = {
	networks: {
		celo_alfajores: {
			url: "https://alfajores-forno.celo-testnet.org",
			accounts: [`8470f20322e3e7b081ddb60179eb483e14c07022986d1b0c1c5da61ab729add4`],
			chainId: 44787,
			gasPrice: 1000000000
		  },
		
	},
	solidity: {
		compilers: [
			{
				version: '0.7.6',
			},
			{
				version: '0.8.6',
			},
		],
	},
	namedAccounts: {
		deployer: 0,
	},
};