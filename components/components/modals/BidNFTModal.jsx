import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import UseFormInput from '../UseFormInput';

export default function BidNFTModal({
	show,
	onHide,
	contract,
	senderAddress,
	tokenId,
	eventId,
	toAddress,
	type,
	Highestbid

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

	async function bidNFT() {

		var BidNFTBTN = document.getElementById("bidNFTBTN")
		BidNFTBTN.disabled = true;
		if (parseInt(Amount) < parseInt(Highestbid)) {
			activateWarningModal(`Amount cannot be under ${Highestbid} ZENIQ`);
			return;
		}else{
			var alertELM = document.getElementById("alert");
			alertELM.style.display = 'none';			
		}
		try	{
			activateWorkingModal("Bidding....")

			const Web3 = require("web3")
            const web3 = new Web3(window.ethereum)
			let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
			 activateWorkingModal("A moment please")
			const result = await web3.eth.sendTransaction({ from: senderAddress, to: toAddress, value: AmountinFull })
			 console.log(result);
			activateWorkingModal("Done! Adding into ZENIQ Network...")

			const tokenUri = await contract.tokenURI(tokenId);
			var parsed = await JSON.parse(tokenUri);
			if (Number(parsed['properties']['price']['description']) < Number(Amount)) {
				parsed['properties']['price']['description'] = Amount;
				parsed['properties']['higherbidadd']['description'] = senderAddress;
	
			}
			let currentDate = new Date();
			const createdObject = {
				title: 'Asset Metadata Bids',
				type: 'object',
				properties: {
					username: {
						type: 'string',
						description: senderAddress
					},
					bid: {
						type: 'string',
						description: Amount
					},
					time: {
						type: 'string',
						description: currentDate
					}
				}
			};
			activateWorkingModal("Please confirm creating Bid...")

			const result2 = await contract.createBid(tokenId, JSON.stringify(createdObject), JSON.stringify(parsed), eventId);
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
			BidNFTBTN.disabled = false;
			await sleep(200)
			window.location.reload();
		}catch(e){
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
				{(type == "Cryptopunk") ? (
					<Modal.Title id="contained-modal-title-vcenter">
						Bid Cryptopunk
					</Modal.Title>) : (
					<Modal.Title id="contained-modal-title-vcenter">
						Bid NFT
					</Modal.Title>
				)}
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
						<Form.Label>Bid Amount in ZENIQ</Form.Label>
						{AmountInput}
					</Form.Group>
					<div className="d-grid">
						<Button variant="primary" id="bidNFTBTN" onClick={bidNFT}>
							Bid NFT
						</Button>

					</div>
				</Form>
			</Modal.Body>

		</Modal>

	);
}
