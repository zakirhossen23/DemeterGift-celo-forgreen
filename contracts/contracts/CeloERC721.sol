// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CeloERC721 is ERC721 {
	uint256 private _tokenIds;
	uint256 private _bidIds;
	uint256 private _eventIds;
	uint256 private _EventTokenIds;
	uint256 private _TokenBidIds;
	string[2] data1;
	uint256 public _EventTokenSearchIds;
	mapping(uint256 => string[2]) private AllEventTokens;
	mapping(uint256 => string[2]) private AllTokensBids;
	mapping(uint256 => string[2]) public _SearchedStore;
	mapping(uint256 => string) private _bidURIs;
	mapping(uint256 => string) private _tokenURIs;
	mapping(uint256 => string) private _eventURIs;
	mapping(uint256 => string) private _eventRaised;
	mapping(string => string) private _eventTokens;

	constructor(string memory name, string memory symbol)
		ERC721(name, symbol)
	{}

	function claimToken(
		address _claimer,
		string memory _tokenURI,
		uint256 _eventid
	) public returns (uint256) {
		_mint(_claimer, _tokenIds);
		_setTokenURI(_tokenIds, _tokenURI);
		_setTokenEvent(_EventTokenIds, _eventid, _tokenURI);
		_tokenIds++;
		_EventTokenIds++;
		return _tokenIds;
	}


	function _setTokenEvent(
		uint256 EventTokenId,
		uint256 EventId,
		string memory _tokenURI
	) public virtual {
		AllEventTokens[EventTokenId] = [
			Strings.toString(EventId),
			string(_tokenURI)
		];
	}

	function createEvent(string memory _eventURI)
		public
		returns (uint256)
	{
		_setEventURI(_eventIds, _eventURI);
		_setEventRaised(_eventIds, "0");
		_eventIds++;

		return _eventIds;
	}

	function gettokenIdByUri(string memory _tokenURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _tokenIds; i++) {
			if (
				keccak256(bytes(_tokenURIs[i])) == keccak256(bytes(_tokenURI))
			) {
				return i;
			}
		}

		return 0;
	}

	function getBidIdByUri(string memory _bidURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _bidIds; i++) {
			if (keccak256(bytes(_bidURIs[i])) == keccak256(bytes(_bidURI))) {
				return i;
			}
		}

		return 0;
	}

	function gettokenSearchEventTotal(uint256 EventID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreToken = new string[](10);

		uint256 _EventTokenSearchIds2 = 0;

		for (uint256 i = 0; i < _EventTokenIds; i++) {
			if (
				keccak256(bytes(AllEventTokens[i][0])) ==
				keccak256(bytes(Strings.toString(EventID)))
			) {
				_SearchedStoreToken[_EventTokenSearchIds2] = AllEventTokens[i][
					1
				];
				_EventTokenSearchIds2++;
			}
		}

		return _SearchedStoreToken;
	}

	function getGetEventsTokenID(uint256 EventId, string memory _tokenURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _EventTokenIds; i++) {
			if (
				keccak256(bytes(AllEventTokens[i][0])) ==
				keccak256(bytes(Strings.toString(EventId))) &&
				keccak256(bytes(AllEventTokens[i][1])) ==
				keccak256(bytes(_tokenURI))
			) {
				return i;
			}
		}

		return 0;
	}

	function _getSearchedTokenURI(uint256 _tokenId)
		public
		view
		virtual
		returns (string memory)
	{
		return _SearchedStore[_tokenId][0];
	}

	function _setEventURI(uint256 eventId, string memory _eventURI)
		public
		virtual
	{
		_eventURIs[eventId] = _eventURI;
		_eventRaised[eventId] = "0";
	}

	function _setTokenURI(uint256 tokenId, string memory _tokenURI)
		public
		virtual
	{
		require(
			_exists(tokenId),
			"ERC721Metadata: URI set of nonexistent token"
		);
		_tokenURIs[tokenId] = _tokenURI;
	}

	function eventURI(uint256 eventId) public view returns (string memory) {
		return _eventURIs[eventId];
	}

	function tokenURI(uint256 tokenId)
		public
		view
		virtual
		override
		returns (string memory)
	{
		require(
			_exists(tokenId),
			"ERC721Metadata: URI query for nonexistent token"
		);

		return _tokenURIs[tokenId];
	}

	function totalSupply() public view returns (uint256) {
		return _tokenIds;
	}

	function totalEvent() public view returns (uint256) {
		return _eventIds;
	}

	function _setBidURI(uint256 bidId, string memory _bidURI) public virtual {
		_bidURIs[bidId] = _bidURI;
	}

	function BidURI(uint256 BidId) public view returns (string memory) {
		return _bidURIs[BidId];
	}

	function getTotalBid(uint256 TokenID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreBid = new string[](10);

		uint256 _TokenBidSearchIds2 = 0;

		for (uint256 i = 0; i < _TokenBidIds; i++) {
			if (
				keccak256(bytes(AllTokensBids[i][0])) ==
				keccak256(bytes(Strings.toString(TokenID)))
			) {
				_SearchedStoreBid[_TokenBidSearchIds2] = AllTokensBids[i][1];
				_TokenBidSearchIds2++;
			}
		}

		return _SearchedStoreBid;
	}

	function getBidsSearchToken(uint256 TokenID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreBid = new string[](10);

		uint256 _TokenBidSearchIds2 = 0;

		for (uint256 i = 0; i < _TokenBidIds; i++) {
			if (
				keccak256(bytes(AllTokensBids[i][0])) ==
				keccak256(bytes(Strings.toString(TokenID)))
			) {
				_SearchedStoreBid[_TokenBidSearchIds2] = AllTokensBids[i][1];
				_TokenBidSearchIds2++;
			}
		}

		return _SearchedStoreBid;
	}

	function _setTokenBid(
		uint256 TokenBidId,
		uint256 TokenId,
		string memory _BidURI
	) public virtual {
		AllTokensBids[TokenBidId] = [
			Strings.toString(TokenId),
			string(_BidURI)
		];
	}
 
 	function getEventRaised(uint256 _eventId)
		public
		view
		virtual
		returns (string memory)
	{
		return _eventRaised[_eventId];
	}

	function _setEventRaised(uint256 _eventId, string memory _raised)
		public
	{
		_eventRaised[_eventId] = _raised;
	}

 
	function createBid(
		uint256 _tokenId,
		string memory _bidURI,
		string memory _updatedURI,
		uint256 _eventid
	) public   {
		uint256 _EventTokenId = getGetEventsTokenID(
			_eventid,
			_tokenURIs[_tokenId]
		);
		_tokenURIs[_tokenId] = _updatedURI;
		_setTokenEvent(_EventTokenId, _eventid, _updatedURI);

		_setTokenBid(_TokenBidIds, _tokenId, _bidURI);
		_TokenBidIds++;
		_bidIds++;
	}
}
