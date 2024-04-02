// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Wuzzles is ERC721 {
    address payable private _royalties_recipient;

    uint256 private _royaltyAmount; //in %
    uint256 public _tokenId;
    uint256 public _maxSupply = 900;

    string[] private _uriComponents;
    string _uri;
    string _unrevealedURI;

    bool _revealed;

    mapping(address => bool) public _isAdmin;

    //URIs:
    /**
    0 => 1/1
    1 => Broken
    2 => Animated
    */

    constructor(string memory unrevealedURI) ERC721("Wuzzles", "WZL") {
        _uriComponents = [
            'data:application/json;utf8,{"name":"',
            '", "description":"',
            '", "image":"',
            '", "image_url":"',
            '"}'
        ];
        _isAdmin[msg.sender] = true;
        _royalties_recipient = payable(msg.sender);
        _royaltyAmount = 750;
        _tokenId = 1;
        _revealed = false;
        _unrevealedURI = unrevealedURI;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721) returns (bool) {
        return
            ERC721.supportsInterface(interfaceId) ||
            interfaceId == type(IEIP2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    modifier adminRequired() {
        require(_isAdmin[msg.sender], "Only admins can perfom this action");
        _;
    }

    function mint(address to) external adminRequired {
        require(_tokenId <= _maxSupply, "Max supply reached");
        _mint(to, _tokenId);
        _tokenId++;
    }

    function toggleAdmin(address admin) external adminRequired {
        _isAdmin[admin] = !_isAdmin[admin];
    }

    function setURI(string calldata uri) external adminRequired {
        _uri = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        bytes memory name;
        bytes memory description;
        bytes memory image;

        name = abi.encodePacked("Wuzzle #", Strings.toString(tokenId));
        description = "a brand for everyone. no limits. no restrictions. available in all shapes, sizes, and colors. (cc0)";
        if (!_revealed) {
            image = bytes(abi.encodePacked(_unrevealedURI));
        } else {
            image = bytes(
                abi.encodePacked(_uri, Strings.toString(tokenId), ".svg")
            );
        }
        bytes memory byteString = abi.encodePacked(
            abi.encodePacked(_uriComponents[0], name),
            abi.encodePacked(_uriComponents[1], description),
            abi.encodePacked(_uriComponents[2], image),
            abi.encodePacked(_uriComponents[4])
        );
        return string(byteString);
    }

    function reveal(string memory revealedURI) external adminRequired {
        _uri = revealedURI;
        _revealed = true;
    }

    function setRoyalties(
        address payable _recipient,
        uint256 _royaltyPerCent
    ) external adminRequired {
        _royalties_recipient = _recipient;
        _royaltyAmount = _royaltyPerCent;
    }

    function royaltyInfo(
        uint256 salePrice
    ) external view returns (address, uint256) {
        if (_royalties_recipient != address(0)) {
            return (_royalties_recipient, (salePrice * _royaltyAmount) / 10000);
        }
        return (address(0), 0);
    }

    function withdraw(address recipient) external adminRequired {
        payable(recipient).transfer(address(this).balance);
    }
}
