// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./interfaces/IUnit.sol";

contract Void2122Unit is ERC721Upgradeable, IUnit {
    uint256 public unitIds;
    uint256 public royaltyAmount;
    address public royalties_recipient;
    string public constant contractName = "Void 2122 - Units";
    mapping(uint256 => Unit) units;
    mapping(address => bool) isAdmin;
    mapping(address => uint256) mods;

    error Unauthorized();

    function initialize() public initializer {
        __ERC721_init("Void 2122 - Units", "V2122Units");
        unitIds = 1;
        royaltyAmount = 10;
        royalties_recipient = msg.sender;
        isAdmin[msg.sender] = true;
    }

    modifier adminRequired() {
        if (!isAdmin[msg.sender]) revert Unauthorized();
        _;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Upgradeable) returns (bool) {
        return
            ERC721Upgradeable.supportsInterface(interfaceId) ||
            interfaceId == type(IEIP2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 id) external adminRequired {
        _mint(to, id);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    function toggleAdmin(address _admin) external adminRequired {
        isAdmin[_admin] = !isAdmin[_admin];
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
        royalties_recipient = _recipient;
        royaltyAmount = _royaltyPerCent;
    }

    function royaltyInfo(
        uint256 salePrice
    ) external view returns (address, uint256) {
        if (royalties_recipient != address(0)) {
            return (royalties_recipient, (salePrice * royaltyAmount) / 100);
        }
        return (address(0), 0);
    }

    function withdraw(address recipient) external adminRequired {
        payable(recipient).transfer(address(this).balance);
    }

    function createUnit(Unit calldata _unit) external {
        units[unitIds] = _unit;
        unitIds++;
        emit UnitCreated(_unit);
    }

    function addMod(
        uint256 _unitId,
        uint256 _modId,
        uint256 _modSlotToReplace
    ) external {
        Unit storage _unit = units[_unitId];
        if (_unit.mods.length < _unit.modSlots) {
            _unit.mods.push(_modId);
        } else {
            _unit.mods[_modSlotToReplace] = _modId;
        }
    }
}
