// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./interfaces/IFactory.sol";
import "./Loot.sol";
import "./Mod.sol";
import "./Schematic.sol";
import "./Unit.sol";

contract Void2122Factory is ERC721Upgradeable, IFactory {
    uint256 public factoryIds;
    address public lootAddress;
    address public modAddress;
    address public schematicAddress;
    address public unitAddress;
    uint256 public royaltyAmount;
    address public royalties_recipient;
    mapping(uint256 => Factory) factories;
    mapping(address => bool) isAdmin;
    mapping(uint256 => uint256) timeLocks;
    mapping(uint256 => uint256) rewardPendingUnlock;
    mapping(uint256 => bool) rewardIsUnit;

    function initialize() public initializer {
        __ERC721_init("Void 2122 - Factories", "");
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

    function setLootAddress(address _lootAddress) external adminRequired {
        lootAddress = _lootAddress;
    }

    function setModAddress(address _modAddress) external adminRequired {
        modAddress = _modAddress;
    }

    function setSchematicAddress(
        address _schematicAddress
    ) external adminRequired {
        schematicAddress = _schematicAddress;
    }

    function setUnitAddress(address _unitAddress) external adminRequired {
        unitAddress = _unitAddress;
    }

    function createFactory(Factory calldata _factory) external {
        factories[factoryIds] = _factory;
        factoryIds++;
        emit FactoryCreated(_factory);
    }

    function craft(uint256 _tokenId, uint256 _schematicId) external {
        if (timeLocks[_tokenId] > block.timestamp) revert FactoryInUse();
        (
            uint256 _craftReward,
            bool _rewardIsUnit,
            uint256 _constructionTime,
            uint256[] memory _lootIds,
            uint256[] memory _amounts
        ) = Void2122Schematic(schematicAddress).validateCraft(_schematicId);
        if (_craftReward == 0) revert InvalidCraft();
        Void2122Schematic(schematicAddress).burn(msg.sender, _schematicId, 1);
        Void2122Loot(lootAddress).burnBatch(msg.sender, _lootIds, _amounts);
        rewardPendingUnlock[_tokenId] = _craftReward;
        rewardIsUnit[_tokenId] = _rewardIsUnit;
        timeLocks[_tokenId] = block.timestamp + _constructionTime;
        emit CraftInitiated();
    }

    function claimCraft(uint256 _tokenId) external {
        if (block.timestamp < timeLocks[_tokenId]) revert TimerOngoing();
        if (rewardPendingUnlock[_tokenId] == 0) revert RewardUnavailable();
        if (msg.sender != IERC721Upgradeable(address(this)).ownerOf(_tokenId))
            revert OnlyOwner();
        if (rewardIsUnit[_tokenId]) {
            Void2122Unit(unitAddress).mint(
                msg.sender,
                rewardPendingUnlock[_tokenId]
            );
        } else {
            Void2122Mod(modAddress).mint(
                msg.sender,
                rewardPendingUnlock[_tokenId],
                1
            );
        }
        rewardPendingUnlock[_tokenId] = 0;
    }
}
