// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface IUnit {
    
    struct Unit {
        uint256 id;
        string name;
        uint256 level;
        uint256 generation;
        string make;
        string model;
        string description;
        string [] uris;
        uint256 [] values;
        string rarity;
        uint256 modificationSlots;
        uint256 [] modifications;
    }

    event UnitCreated(Unit);

    function createUnit(Unit calldata _unit) external;

}