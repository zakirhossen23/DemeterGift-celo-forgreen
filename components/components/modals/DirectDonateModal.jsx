import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import UseFormInput from '../UseFormInput';

export default function DirectDonateModal({
	show,
	onHide,
	eventId,
	contract,
	senderAddress,
	EventWallet,

}) {
	const [Alert, setAlert] = useState('');

	const Web3 = require("web3")

	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}


	const [Amount, AmountInput] = UseFormInput({
		type: 'text',
		placeholder: 'Amount',
	});

	function activateWarningModal(TextAlert) {
		var alertELM = document.getElementById("alert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}
	function activateWorkingModal(TextAlert) {
		var alertELM = document.getElementById("workingalert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}

	async function DonateCoin() {

		var DonateBTN = document.getElementById("DonateBTN");
		var SelectCoin = document.getElementById("stablecoin");
		DonateBTN.disabled = true;

		try {
			activateWorkingModal("Transferring....")
			const Web3 = require("web3")
			const ContractKit = require('@celo/contractkit')
			const web3 = new Web3(window.ethereum)
			const kit = ContractKit.newKitFromWeb3(web3)
			
			let celotoken = await kit.contracts.getGoldToken();
			let cUSDtoken = await kit.contracts.getStableToken();
			let cEURtoken = await kit.contracts.getStableToken("cEUR");

			let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
			console.log("Donating")
			if (SelectCoin.value == "CELO") {
				let celotx = await celotoken
					.transfer(EventWallet, AmountinFull)
					.send({ from: senderAddress, gas:2100000, gasPrice:10000000000  });
				let celoReceipt = await celotx.waitReceipt();
			}
			if (SelectCoin.value == "cEUR") {
				let cEURtx = await cEURtoken
					.transfer(EventWallet, AmountinFull)
					.send({ from: senderAddress, gas:2100000, gasPrice:10000000000 });
				let cEURReceipt = await cEURtx.waitReceipt();

			}
			if (SelectCoin.value == "cUSD") {
				let cUSDtx = await cUSDtoken
					.transfer(EventWallet, AmountinFull)
					.send({ from: senderAddress, gas:2100000, gasPrice:10000000000 });
				let cUSDReceipt = await cUSDtx.waitReceipt();
			}
			const Raised = Number( await contract.getEventRaised(eventId)) + Number(Amount);
			
			activateWorkingModal("Done! Please confirm Updating Raised...")

			const result2 = await contract._setEventRaised(eventId, Raised.toString());
			activateWorkingModal("A moment please")
			const expectedBlockTime = 1000;
			let transactionReceipt = null
			while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
				transactionReceipt = await web3.eth.getTransactionReceipt(result2.hash);
				await sleep(expectedBlockTime)
			}

			console.log(transactionReceipt);
			activateWorkingModal("Success!")
			window.document.getElementsByClassName("btn-close")[0].click();
			DonateBTN.disabled = false;
			await sleep(200)
			window.location.reload();
		} catch (e) {
			console.error(e);
			activateWarningModal(`Error! Please try again!`);
			var alertELM = document.getElementById("workingalert");
			alertELM.style.display = 'none';
			return;
		}

	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Donate Coin
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<Form>
					<div id='alert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-danger" role="alert">
						{Alert}
					</div>
					<div id='workingalert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-success" role="alert">
						{Alert}
					</div>
					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Stablecoin</Form.Label>
						<Form.Select id='stablecoin'>
							<option selected value="CELO">CELO</option>
							<option value="cEUR">cEUR</option>
							<option value="cUSD">cUSD</option>
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Amount</Form.Label>
						{AmountInput}
					</Form.Group>
					<div className="d-grid">
						<Button variant="primary" id="DonateBTN" onClick={DonateCoin}>
							Donate
						</Button>

					</div>
				</Form>
			</Modal.Body>

		</Modal>

	);
}
