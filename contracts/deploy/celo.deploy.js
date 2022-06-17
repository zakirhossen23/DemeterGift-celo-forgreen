// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'CUSD';
	const symbol = 'cUSD';

	await deploy('CeloERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['cUSD'];
module.exports = func;
