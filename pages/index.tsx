import React from 'react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Header } from '../components/layout/Header'
import Head from 'next/head';

declare let window: any;
export default function Welcome() {
	const router = useRouter();
	function donateCLICK() {
		if (typeof window.ethereum === 'undefined') {
			window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
		} else {
			router.push('/donation');
		}
	}

	function CreateEventsCLICK() {
		if (typeof window.ethereum === 'undefined') {
			window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
		} else {
			router.push('/CreateEvents');
		}
	}
	return (<>
		<Head>
			<title>DemeterGift</title>
			<meta name="description" content="DemeterGift" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<Header></Header>
		<div className="welcome mb-5">
			<div className="welcome row" style={{ flexDirection: 'column', alignItems: 'center' }}>
				<img src="https://i.postimg.cc/Lsxrbz02/Logo-2.png" className='welcome img' />
				<div className="text-center">
					<h1 className='welcome title'>A gift with a story</h1>
				</div>
				<div className="text-center">
					<h4 className='welcome description' >
						DemeterGift creates the most easy, transparent and fun NFT charity auction
						on Web3
					</h4>
				</div>
				<div className="Welcome DonateBTN col">
					<div onClick={donateCLICK} style={{
						background: 'rgb(236, 201, 0)',
						textAlign: 'center',
						cursor: 'pointer',
						height: '58px',
						display: 'flex',
						fontSize: '20px',
						color: 'white',
						alignItems: 'center',
						borderRadius: '5px',
						justifyContent: 'center',
						margin: '0px'
					}} className="card card-body">
						<div >Let’s donate!</div>
					</div>
				</div>
			</div>

			<div className="Event row">
				<img style={{ padding: '0px', width: '-webkit-fill-available', height: '96%' }} src="/Panel.svg" />
				<img style={{ "position": "absolute", "bottom": "0" }} src="/CharityHand.svg" />
				<img style={{ padding: '0px', position: 'absolute', width: '61%', marginTop: '10%' }} src="/CharityText.svg" />
				<div onClick={CreateEventsCLICK} className="welcome card-body EventBTN">
					<span>
						Start event
					</span>
				</div>
			</div>
		</div>
	</>

	);
}