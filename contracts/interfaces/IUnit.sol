// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface IUnit {
    
    struct Unit {
        uint256 id;
        uint256 tokenId;
        string name;
        uint256 level;
        uint256 generation;
        string make;
        string model;
        string description;
        string [] uris;
        uint256 [] values;
        string rarity;
        uint256 modSlots;
        uint256 [] mods;
    }

    event UnitCreated(Unit);

    function createUnit(Unit calldata _unit) external;

    // function addMod(uint256 unitId, uint256 modId) external;

    // function destroyMod(uint256 unitId, uint256 modId) external;

    // function switchVisual(uint256 unitId, uint256 modId) external;

}