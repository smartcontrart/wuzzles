// SPDX-License-Identifier: MIT

pragma solidity >=0.8.17;

import "./Wuzzles.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WuzzlesMint {
    uint256 public _price = 0.009 ether;

    address public _wuzzlesAddress;
    address private _signer;
    address private _recipient;

    bool public _privateMintOpened;
    bool public _publicMintOpened;

    mapping(address => bool) public _isAdmin;
    mapping(address => bool) public _minted;

    constructor(address wuzzlesAddress) {
        _recipient = msg.sender;
        _signer = msg.sender;
        _wuzzlesAddress = wuzzlesAddress;
        _isAdmin[msg.sender] = true;
    }

    modifier allowed(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) {
        require(
            _signer ==
                ecrecover(
                    keccak256(
                        abi.encodePacked(
                            "\x19Ethereum Signed Message:\n32",
                            keccak256(
                                abi.encodePacked(
                                    msg.sender,
                                    _wuzzlesAddress,
                                    _minted[msg.sender]
                                )
                            )
                        )
                    ),
                    v,
                    r,
                    s
                ),
            "Invalid signature"
        );
        _;
    }

    function toggleAdmin(address newAdmin) external {
        require(_isAdmin[msg.sender]);
        _isAdmin[newAdmin] = !_isAdmin[newAdmin];
    }

    function setRecipient(address recipient) external {
        require(_isAdmin[msg.sender]);
        _recipient = recipient;
    }

    function setWuzzlesAddress(address wuzzlesAddress) external {
        require(_isAdmin[msg.sender]);
        _wuzzlesAddress = wuzzlesAddress;
    }

    function setSigner(address signer) external {
        require(_isAdmin[msg.sender]);
        _signer = signer;
    }

    function togglePrivateMintStatus() external {
        require(_isAdmin[msg.sender]);
        _privateMintOpened = !_privateMintOpened;
    }

    function togglePublicMintStatus() external {
        require(_isAdmin[msg.sender]);
        _publicMintOpened = !_publicMintOpened;
    }

    function privateMint(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable allowed(v, r, s) {
        require(_privateMintOpened, "Private Mint closed");
        mint();
    }

    function publicMint() external payable {
        require(_publicMintOpened, "Public Mint closed");
        mint();
    }

    function mint() internal {
        require(msg.value >= _price, "Not enough funds");
        require(_minted[msg.sender] == false, "Only one NFT per wallet");
        _minted[msg.sender] = true;
        bool success = payable(_recipient).send(_price);
        require(success, "Funds could not transfer");
        Wuzzles(_wuzzlesAddress).mint(msg.sender);
    }
}
