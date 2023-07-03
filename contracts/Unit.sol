// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IUnit.sol";
import "./Corporation.sol";
import "./Mod.sol";

contract Void2122Unit is ERC721Upgradeable, IUnit {
    uint256 public unitIds;
    uint256 public tokenId;
    uint256 public royaltyAmount;
    address public royalties_recipient;
    address public corporationAddress;
    address public modAddress;
    string public constant contractName = "Void 2122 - Units";
    mapping(uint256 => Unit) units;
    mapping(uint256 => UnitTemplate) unitTemplates;
    mapping(address => bool) isAdmin;
    mapping(address => uint256) mods;
    string[] uriComponents;

    error Unauthorized();

    function initialize() public initializer {
        __ERC721_init("Void 2122 - Units", "V2122Units");
        unitIds = 1;
        tokenId = 1;
        royaltyAmount = 10;
        royalties_recipient = msg.sender;
        isAdmin[msg.sender] = true;
        uriComponents = [
            'data:application/json;utf8,{"name":"',
            '", "description":"',
            '", "image":"',
            '", "animation":"',
            '", "attributes":[',
            "]}"
        ];
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

    function mint(address _to, uint256 _unitTemplate) external adminRequired {
        Unit memory _unit = Unit(_unitTemplate, 0, new uint256[](0));
        units[tokenId] = _unit;
        _mint(_to, tokenId);
        tokenId++;
    }

    function burn(uint256 _tokenId) public {
        _burn(_tokenId);
    }

    function toggleAdmin(address _admin) external adminRequired {
        isAdmin[_admin] = !isAdmin[_admin];
    }

    function setCorporationAddress(
        address _corporationAddress
    ) external adminRequired {
        corporationAddress = _corporationAddress;
    }

    function setModAddress(address _modAddress) external adminRequired {
        modAddress = _modAddress;
    }

    function getCorporation(
        uint256 _tokenId
    ) public view returns (bytes memory) {
        string memory corpName = Void2122Corporation(corporationAddress)
            .getPlayerCorporation(ownerOf(_tokenId));
        if (
            keccak256(abi.encodePacked(corpName)) ==
            keccak256(abi.encodePacked(""))
        ) {
            return abi.encodePacked(corpName);
        } else {
            return
                abi.encodePacked(
                    '"}, {"trait_type": "Corporation", "value": "',
                    corpName
                );
        }
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        Unit memory _unit = units[_tokenId];
        UnitTemplate memory _unitTemplate = unitTemplates[_unit.template];
        bytes memory corporation = getCorporation(_tokenId);
        bytes memory attributes = abi.encodePacked(
            abi.encodePacked(
                '{"trait_type": "Level", "value": "',
                Strings.toString(_unitTemplate.level),
                '"}, {"trait_type": "Generation", "value": "',
                Strings.toString(_unitTemplate.generation),
                corporation,
                '"}, {"trait_type": "Model", "value": "',
                _unitTemplate.model,
                '"}, {"trait_type": "Rarity", "value": "',
                _unitTemplate.rarity,
                '"}, {"trait_type": "Total Mods Available", "value": "'
            ),
            abi.encodePacked(
                Strings.toString(_unitTemplate.modSlots),
                '"}, {"trait_type": "Value Top", "value": "',
                Strings.toString(_unitTemplate.values[0]),
                '"}, {"trait_type": "Value Left", "value": "',
                Strings.toString(_unitTemplate.values[1]),
                '"}, {"trait_type": "Value Bottom", "value": "',
                Strings.toString(_unitTemplate.values[2]),
                '"}, {"trait_type": "Value Right", "value": "',
                Strings.toString(_unitTemplate.values[3]),
                '"}'
            )
        );
        bytes memory byteString = abi.encodePacked(
            abi.encodePacked(uriComponents[0], _unitTemplate.name),
            abi.encodePacked(uriComponents[1], _unitTemplate.description),
            abi.encodePacked(
                uriComponents[2],
                _unitTemplate.uris[_unit.visual]
            ),
            abi.encodePacked(uriComponents[3], _unitTemplate.animation),
            abi.encodePacked(uriComponents[4], attributes),
            abi.encodePacked(uriComponents[5])
        );
        return string(byteString);
    }

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

    function createUnitTemplate(UnitTemplate calldata _unitTemplate) external {
        unitTemplates[unitIds] = _unitTemplate;
        unitIds++;
        emit UnitTemplateCreated(_unitTemplate);
    }

    function checkModBalance(Unit storage _unit, uint256 _modId) internal view {
        uint8 modsNeeded = 1;
        for (uint8 i = 0; i < _unit.mods.length; i++) {
            if (_unit.mods[i] == _modId) {
                modsNeeded++;
            }
        }
        if (Void2122Mod(modAddress).balanceOf(msg.sender, _modId) < modsNeeded)
            revert ModBalanceInsufficient(_modId);
    }

    function addMod(uint256 _tokenId, uint256 _modId) external {
        Unit storage _unit = units[_tokenId];
        UnitTemplate memory _unitTemplate = unitTemplates[_unit.template];
        if (_unit.mods.length >= _unitTemplate.modSlots) {
            revert NoModSpaceAvailable();
        }
        checkModBalance(_unit, _modId);
        _unit.mods.push(_modId);
        emit ModAdded(_tokenId, _modId);
    }

    function replaceMod(
        uint256 _tokenId,
        uint256 _modId,
        uint256 _positionOfModToReplace
    ) external {
        Unit storage _unit = units[_tokenId];
        UnitTemplate memory _unitTemplate = unitTemplates[_unit.template];
        if (_positionOfModToReplace >= _unitTemplate.modSlots)
            revert ModPositionInvalid(_positionOfModToReplace);
        checkModBalance(_unit, _modId);
        _unit.mods[_positionOfModToReplace] = _modId;
        emit ModAdded(_tokenId, _modId);
    }

    function destroyMod(
        uint256 _tokenId,
        uint256 _positionOfModToDestroy
    ) external {
        Unit storage _unit = units[_tokenId];
        if (_positionOfModToDestroy >= _unit.mods.length)
            revert ModPositionInvalid(_positionOfModToDestroy);
        _unit.mods[_positionOfModToDestroy] = 0;
    }

    function switchVisual(uint256 _tokenId, uint256 _visual) external {
        // Need to add check for a valid visual
        Unit storage _unit = units[_tokenId];
        _unit.visual = _visual;
    }
}
