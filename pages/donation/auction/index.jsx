import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BidNFTModal from '../../../components/components/modals/BidNFTModal';
import ViewBidNFTModal from '../../../components/components/modals/ViewBidNFTModal';
import DonateNFTModal from '..//..//..//components/components/modals/DonateNFTModal';

import useContract from '../../../services/useContract';
import { Header } from '../../../components/layout/Header'
import isServer from '../../../components/isServer';

export default function AuctionNFT(user) {

    const { contract, signerAddress } = useContract('ERC721');
    const router = useRouter();
    const [eventId, setEventId] = useState(-1);
    const [list, setList] = useState([]);
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [title, setTitle] = useState('');
    const [goalusd, setgoalusd] = useState('');
    const [goal, setgoal] = useState('');
    const [EventEarned, setEventEarned] = useState('');
    const [EventDescription, setEventDescription] = useState('');
    const [dateleft, setdateleft] = useState(''); 
    const [SelectedendDate, setSelectedendDate] = useState('');
    const [date, setdate] = useState('');
    const [dateleftBid, setdateleftBid] = useState('');
    const [logo, setlogo] = useState('');
    const [selectid, setselectid] = useState('');
    const [selecttitle, setselecttitle] = useState('');
    const [selectedAddress, setselectedAddress] = useState('');
    const [selecttype, setselecttype] = useState('');
    const [selectbid, setselectbid] = useState('');

    const [eventuri, setEventuri] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [ViewmodalShow, setViewModalShow] = useState(false);
    const [DonatemodalShow, setDonateModalShow] = useState(false);
    
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let m;
    let id = "";
    function LeftDate(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds");
    }
    function LeftDateBid(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + "d " + h.toString() + "h " + m.toString() + "m " + s.toString() + "s");
    }

    useEffect(() => {
        if (!isServer()) {
            fetchContractData();
        }

    }, [id, contract]);
    if (isServer()) return null;
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        id = m[1];
    }

    async function fetchContractData() {
        try {
            if (contract && id) {
                setEventId(id);
                const value = await contract.eventURI(id);
                const arr = [];
                const totalTokens = await contract.gettokenSearchEventTotal(id);
                let totalEarned = 0
                for (let i = 0; i < Number(10); i++) {
                    const obj = await totalTokens[i];

                    let object = {};
                    try { object = await JSON.parse(obj) } catch { }
                    if (object.title) {
                        var pricedes1 = 0;
                        try { pricedes1 = formatter.format(Number(object.properties.price.description * 1.10)) } catch (ex) { }
                        const TokenId = Number(await contract.gettokenIdByUri(obj));
                        totalEarned += Number(object.properties.price.description)
                        console.log(TokenId);
                        arr.push({
                            Id: TokenId,
                            name: object.properties.name.description,
                            description: object.properties.description.description,
                            Bidprice: pricedes1,
                            price: Number(object.properties.price.description),
                            type: object.properties.typeimg.description,
                            image: object.properties.image.description,
                        });
                    }

                }

                setList(arr);
                if (document.getElementById("Loading"))
                    document.getElementById("Loading").style = "display:none";


                setEventuri(value);

                const object = JSON.parse(value);
                setTitle(object.properties.Title.description);
                setselectedAddress(object.properties.wallet.description);
                setgoalusd(formatter.format(Number(object.properties.Goal.description * 1.10)));
                setgoal(Number(object.properties.Goal.description));
                setEventEarned(formatter.format(totalEarned))
                setEventDescription(object.properties.Description.description)
                setdateleft(LeftDate(object.properties.Date.description));
                setSelectedendDate(object.properties.Date.description);
                setdate(object.properties.Date.description);
                setdateleftBid(LeftDateBid(object.properties.Date.description));
                setlogo(object.properties.logo.description);
                setTokenName(await contract.name());
                setTokenSymbol(await contract.symbol());

            }
        } catch (error) {
            console.error(error);
        }
    }


    setInterval(function () {
        calculateTimeLeft();
    }, 1000);


    function calculateTimeLeft() {
        try {
            var allDates = document.getElementsByName("dateleft");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDate(date);
            }
            var allDates = document.getElementsByName("date");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDateBid(date);
            }
        } catch (error) {

        }

    }

    function activateViewBidModal(e) {
        setselectid(e.target.getAttribute("tokenid"));
        setselecttitle(e.target.getAttribute("title"));

        setViewModalShow(true);
    }

    function activateBidNFTModal(e) {
        setselectid(e.target.getAttribute("tokenid"));
        setselectbid(e.target.getAttribute("highestbid"));
        console.log(selectbid);
        setselecttype("NFT");
        setModalShow(true);
    }
    function activateDonateNFTModal(e) {
        setDonateModalShow(true);
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            {/* <div className="row Auction EventContainer" >
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', padding: '7px' }}>
                    <img src={logo} className="Auction Event-Image AuctionImage" />
                    <div className="DetialsContainer">
                        <h6 className='Auction Event-Title'>{title}</h6>

                        <div className='TextContainer'>
                            <h6 className="Auction Event-small-Text">Goal: </h6>
                            <h6 className="Auction Event-goal-price">{goal} ZENIQ</h6>
                        </div>
                        <div className='TextContainer'>
                            <h6 className="Auction Event-small-Text" name='dateleft' date={date}>{dateleft}</h6>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="p-campaign" data-view-id="pg_donate_index" >
                <div className="p-campaign-collage color-background-blue" >
                    <div className="image-16by9 m-collage-image">
          


                        <img className="a-image a-image--background" src={logo} />
                    </div>
                </div>
                <header className="p-campaign-header" >
                    <h1 className="mb0 a-campaign-title">
                        {title}
                    </h1>
                </header>
                <div className="p-campaign-sidebar" >
                    <aside className="o-campaign-sidebar" >
                        <div className="o-campaign-sidebar-wrapper" >
                            <div className="o-campaign-sidebar-progress-meter m-progress-meter">
                                <progress
                                    className="a-progress-bar a-progress-bar--green"
                                    max={100}
                                    value={(EventEarned * 100)/goal}
                                />
                                <h2 className="m-progress-meter-heading" >
                                    {EventEarned}
                                    <span className="text-stat text-stat-title" >
                                        ZENIQ raised of {goal} ZENIQ goal
                                    </span>
                                </h2>
                            </div>
                            <div className="p-campaign-share-donate-buttons">
                                <a
                                    className="p-campaign-share-button-exp mb2x m-auto hrt-gradient-button hrt-gradient-button--gradient-orange hrt-gradient-button--full hrt-gradient-button--shadow hrt-base-button"
                                    data-element-id="btn_donate"
                                      data-analytic-event-listener="true"
                                      onClick={activateDonateNFTModal}
                                >
                                    <span className="hrt-gradient-button-text">Donate NFT</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
                <div className="p-campaign-description" style={{ gridArea: "description" }}>
                    <div className="m-campaign-byline">
                        <div className="m-campaign-byline-members">
                            <ul className="list-unstyled hrt-avatar-stack m-campaign-byline-avatar-stack" />
                            <div
                                className="m-campaign-byline-description"
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    margin: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Description
                            </div>
                        </div>
                    </div>
                    <div className="mb0 mt0 hrt-rule hrt-rule--horizontal" />
                    <div
                        className="o-campaign-description"
                        style={{
                            maxWidth: 664,
                            position: "relative",
                            gridArea: "description",
                            marginTop: "1.5rem",
                            boxSizing: "inherit"
                        }}
                    >
                        <div className="o-campaign-story mt3x" >
                           {EventDescription}
                        </div>
                    </div>
                </div>
            </div>


            {/* <div id='Loading' className="LoadingArea">
                <h1>Loading...</h1>
            </div> */}
            <div className='auction NFTs-container' >
                {list.map((listItem) => (
                    <div key={listItem.Id} className="row auction ElementsContainer bgWhite">
                        <div className='auction NFt-contain' >

                            <img src={listItem.image} className="auction AuctionBidImage" />
                            <div style={{ width: '100%', display: 'flex', height: '100%', padding: '5px 0px', position: 'relative', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <div className="DetialsContainer" style={{ rowGap: "5px" }} >
                                    <h6 className='Auction NFT-title'>{listItem.name}</h6>
                                    <div className="TextContainer">
                                        <h6 className="Auction NFT-Description" style={{ color: "#8B8B8B" }}>{listItem.description}</h6>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                                    <h6 className="Auction Grey-text smallgrey">Current bid</h6>
                                    <h6 className='Auction priceText bidprice'>{listItem.price} ZENIQ</h6>
                                    <h6 name="date" date={date} className="Auction Grey-text smallgrey">{dateleftBid}</h6>
                                </div>
                                <div className='Auction ElementBottomContainer'>

                                    <div className='BidAllcontainer' >
                                        <div className='Bidsbutton'>
                                            <div tokenid={listItem.Id} title={listItem.name} onClick={activateViewBidModal} className="Bidcontainer col">
                                                <div tokenid={listItem.Id} title={listItem.name} className="card BidcontainerCard">
                                                    <div tokenid={listItem.Id} title={listItem.name} className="card-body bidbuttonText">View</div>
                                                </div>
                                            </div>

                                            {(window.localStorage.getItem('Type') == "" || window.localStorage.getItem('Type') == null || window.localStorage.getItem('Type') == "manager") ? (<>

                                            </>) : (<>

                                                <div tokenid={listItem.Id} highestbid={listItem.price} onClick={activateBidNFTModal} className="Bidcontainer col">
                                                    <div tokenid={listItem.Id} highestbid={listItem.price} className="card BidcontainerCard">
                                                        <div tokenid={listItem.Id} highestbid={listItem.price} className="card-body bidbuttonText">Bid</div>
                                                    </div>
                                                </div>
                                            </>)}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <BidNFTModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    // This is a poor implementation, better to implement an event listener
                    fetchContractData();
                }}
                contract={contract}
                tokenId={selectid}
                senderAddress={signerAddress}
                toAddress={selectedAddress}
                type={selecttype}
                eventId={eventId}
                Highestbid={selectbid}
            />

            <ViewBidNFTModal
                show={ViewmodalShow}
                onHide={() => {
                    setViewModalShow(false);
                    // This is a poor implementation, better to implement an event listener
                    fetchContractData();
                }}
                id={selectid}
                title={selecttitle}
            />
            
            <DonateNFTModal
                show={DonatemodalShow}
                onHide={() => {
                    setDonateModalShow(false);
                }}
                contract={contract}
                senderAddress={signerAddress}
                EventID={eventId}
                type={"NFT"}
                SelectedTitle={title}
                enddate={SelectedendDate}
            />
        </>
    );
}
