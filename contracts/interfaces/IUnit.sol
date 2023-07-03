// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IUnit {
    struct UnitTemplate {
        uint256 id;
        string name;
        uint256 level;
        uint256 generation;
        string corporation;
        string model;
        string description;
        string image;
        string animation;
        string[] uris;
        uint256[] values;
        string rarity;
        uint256 modSlots;
    }

    struct Unit {
        uint256 template;
        uint256[] mods;
    }

    error ModBalanceInsufficient(uint256);
    error ModPositionInvalid(uint256);
    error NoModSpaceAvailable();

    event ModAdded(uint256, uint256);
    event UnitTemplateCreated(UnitTemplate);

    function createUnitTemplate(UnitTemplate calldata _unitTemplate) external;

    function addMod(uint256 _tokenId, uint256 modId) external;

    function destroyMod(uint256 _tokenId, uint256 modId) external;

    function replaceMod(
        uint256 _tokenId,
        uint256 _modId,
        uint256 _positionOfModToReplace
    ) external;

    // function switchVisual(uint256 unitId, uint256 modId) external;
}
