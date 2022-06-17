import React from 'react';
import { Header } from '../../components/layout/Header';
import Head from 'next/head';
import isServer from '../../components/isServer';
export default function Login() {
    if (isServer()) return null;
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;
    let redirecting = "";
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        redirecting = m[1];
    }


    async function TypeSet(e) {
        window.localStorage.setItem("Type", e.target.getAttribute("type"));
        await onClickConnectCelo()
        window.location.href = redirecting;
    }
    //Celo
    async function onClickConnectCelo() {
        let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        result;
        try {
            const getacc = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaef3', }], //44787
            });
            getacc;
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0xaef3', //44787
                                chainName: 'Alfajores Celo Testnet',
                                nativeCurrency: {
                                    name: 'CELO',
                                    symbol: 'CELO',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
                            },
                        ],
                    });
                } catch (addError) {
                    // handle "add" error
                    console.log(addError);
                }
            }
            // handle other "switch" errors
        }
        window.localStorage.setItem("ConnectedMetaCelo", "true")
    }
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    function EventManger() {
        if (window.localStorage.getItem("Type") == "manager") {
            return (<>
                <div type="manager" onClick={TypeSet} className='Login eventManagerButton active'>
                    <span type="manager" style={{ color: "yellow" }}>Event Manager</span>
                </div>
            </>)
        }
        return (<>
            <div type="manager" onClick={TypeSet} className='Login eventManagerButton'>
                <span type="manager" style={{ color: "yellow" }}>Event Manager</span>
            </div>
        </>)
    }
    function DonatorType() {
        if (window.localStorage.getItem("Type") == "Donator") {
            return (<>
                <div type="Donator" onClick={TypeSet} className='Login userButton active'>
                    <span type="Donator" style={{ color: "black" }}>Donator</span>
                </div>
            </>)
        }
        return (<>
            <div type="Donator" onClick={TypeSet} className='Login userButton'>
                <span type="Donator" style={{ color: "black" }}>Donator</span>
            </div>
        </>)

    }
    return (
        <><>
            <Head>
                <title>Login</title>
                <meta name="description" content="DemeterGift - Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            <div className="Login row">
                <div className="Login col">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className='Login container' style={{ background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                            <div style={{ margin: "0px 0px 30px 0px" }}>
                                <h1 style={{ marginBottom: "10px" }}>Login</h1>
                            </div>

                            <div style={{ margin: "18px 0px", display: "flex", justifyContent: "space-between" }} >
                                <EventManger />
                                <DonatorType />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </></>
    );
}