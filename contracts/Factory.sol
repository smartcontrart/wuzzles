// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./interfaces/IFactory.sol";
import "./Loot.sol";
import "./Mod.sol";
import "./Schematic.sol";
import "./Unit.sol";

contract Void2122Factory is ERC1155Upgradeable, IFactory {
    uint256 public factoryIds;
    address public lootAddress;
    address public modAddress;
    address public schematicAddress;
    address public unitAddress;
    uint256 public royaltyAmount;
    address public royalties_recipient;
    string constant public contractName = "Void 2122 - Factories";
    mapping (uint256 => Factory) factories;
    mapping(address => bool) isAdmin;

    error Unauthorized();

    function initialize() public initializer {
        __ERC1155_init("");
        factoryIds = 1;
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

    function setLootAddress(address _lootAddress) external adminRequired{
        lootAddress = _lootAddress;
    }

    function setModAddress(address _modAddress) external adminRequired{
        modAddress = _modAddress;
    }

    function setSchematicAddress(address _schematicAddress) external adminRequired{
        schematicAddress = _schematicAddress;
    }

    function setUnitAddress(address _unitAddress) external adminRequired{
        unitAddress = _unitAddress;
    }

    function createFactory(Factory calldata _factory) external {
        factories[factoryIds] = _factory;
        factoryIds ++;
        emit FactoryCreated(_factory);
    }

    function craft(uint256 _schematicId, uint256 [] calldata _lootIds, uint256 [] calldata _amounts) external {
        Void2122Schematic(schematicAddress).validateCraft(_schematicId, _lootIds, _amounts);
        Void2122Schematic(schematicAddress).burn(_schematicId, 1);
        _burnBatch(msg.sender, _lootIds, _amounts);
        // _mintBatch(
        //     msg.sender, 
        //     craftsIds[keccak256(abi.encodePacked(_loots, _amounts))], 
        //     craftsQuantities[keccak256(abi.encodePacked(_loots, _amounts))], 
        //     '0x0'
        // );
    }

}
