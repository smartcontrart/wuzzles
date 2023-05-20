// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./interfaces/ICorporation.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/ILoot.sol";
import "./interfaces/IModification.sol";
import "./interfaces/IUnit.sol";

contract Void2122 is ERC1155Upgradeable, ICorporation, IFactory, ILoot, IModification, IUnit {
    uint256 tokenId;
    uint256 unitIds;
    uint256 lootIds;
    uint256 factoryIds;
    uint256 corporationIds;
    uint256 modificationIds;
    uint256 _royaltyAmount;
    address _royalties_recipient;
    string constant public contractName = "Void 2122";
    mapping (uint256 => Unit) units;
    mapping (uint256 => Loot) loots;
    mapping (uint256 => Factory) factories;
    mapping (uint256 => Corporation) corporations;
    mapping (uint256 => Modification) modifications;
    mapping(address => bool) isAdmin;

    error Unauthorized();

    function initialize() public initializer {
        __ERC1155_init("");
        tokenId = 1;
        unitIds = 1;
        lootIds = 1;
        factoryIds = 1;
        corporationIds = 1;
        modificationIds = 1;
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

    function createCorporation(Corporation calldata _corporation)external{
        corporations[corporationIds] = _corporation;
        corporationIds ++;
        emit CorporationCreated(_corporation);
    }

    function disbandCorporation(Corporation calldata _corporation)external{}

    function createFactory(Factory calldata _factory)external{
        factories[factoryIds] = _factory;
        factoryIds ++;
        emit FactoryCreated(_factory);
    }

    function createLoot(Loot calldata _loot)external {
        loots[lootIds] = _loot;
        lootIds ++;
        emit LootCreated(_loot);
    }

    function createModification(Modification calldata _modification)external {
        modifications[modificationIds] = _modification;
        modificationIds ++;
        emit ModificationCreated(_modification);
    }

    function createUnit(
        Unit calldata _unit
    )external{
        units[unitIds] = _unit;
        unitIds ++;
        emit UnitCreated (_unit);
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

    // function burn(uint256 tokenId, uint256 quantity) public {
    //     _burn(msg.sender, tokenId, quantity);
    // }

    function burnBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        _burnBatch(msg.sender, ids, amounts);
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
            return (_royalties_recipient, (salePrice * _royaltyAmount) / 100);
        }
        return (address(0), 0);
    }

    function withdraw(address recipient) external adminRequired {
        payable(recipient).transfer(address(this).balance);
    }
}
