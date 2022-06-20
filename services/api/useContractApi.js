import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import ERC721Singleton from './ERC721SingletonApi';

export default  function useContract(privateKey) {
	let contract = null;
	const fetchData = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org")

			const signer = new ethers.Wallet(privateKey, provider);

			// Sets a single instance of a specific contract per application
			// Useful for switching across multiple contracts in a single application
			contract = ERC721Singleton(signer);

		} catch (error) {
			console.error(error);
		}
	};

	 fetchData();
	return contract;
}
