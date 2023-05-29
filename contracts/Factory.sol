// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./interfaces/IFactory.sol";

contract Void2122Factory is ERC1155Upgradeable, IFactory {
    uint256 public factoryIds;
    uint256 public _royaltyAmount;
    address public _royalties_recipient;
    string constant public contractName = "Void 2122 - Factories";
    mapping (uint256 => Factory) factories;
    mapping(address => bool) isAdmin;

    error Unauthorized();

    function initialize() public initializer {
        __ERC1155_init("");
        factoryIds = 1;
        isAdmin[msg.sender] = true;
    }

    modifier adminRequired() {
        if (!isAdmin[msg.sender]) revert Unauthorized();
        _;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155Upgradeable) returns (bool) {
        return
            ERC1155Upgradeable.supportsInterface(interfaceId) ||
            interfaceId == type(IEIP2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function name() public pure returns (string memory) {
        return contractName;
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external adminRequired {
        _mint(to, id, amount, "0x0");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external adminRequired {
        _mintBatch(to, ids, amounts, "0x0");
    }

    function burn(uint256 tokenId, uint256 quantity) public {
        _burn(msg.sender, tokenId, quantity);
    }

    function burnBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        _burnBatch(msg.sender, ids, amounts);
    }

    // function uri(
    //     uint256 tokenId
    // ) public view virtual override returns (string memory) {
    //     if (tokenId == 1 && !_advancedCardShifted) {
    //         return
    //             string(abi.encodePacked(_uri, Strings.toString(14), ".json"));
    //     }
    //     return
    //         string(abi.encodePacked(_uri, Strings.toString(tokenId), ".json"));
    // }


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
            return (_royalties_recipient, (salePrice * _royaltyAmount) / 100);
        }
        return (address(0), 0);
    }

    function withdraw(address recipient) external adminRequired {
        payable(recipient).transfer(address(this).balance);
    }

    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                       FACTORIES                        //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////

    function createFactory(Factory calldata _factory) external {
        factories[factoryIds] = _factory;
        factoryIds ++;
        emit FactoryCreated(_factory);
    }

}
