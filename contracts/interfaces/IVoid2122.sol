// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface IVoid2122 {

    struct Corporation{
        uint256 id;
        uint256 tokenId;
        address owner;
        string name;
        string description;
        string uri;
    }

    struct Factory {
        uint256 id;
        uint256 tokenId;
        string name;
        string description;
        string uri;
    }

    struct Loot {
        uint256 id;
        uint256 tokenId;
        string name;
        string description;
        string uri;
        bool isBroken;
    }

    struct Mod{
        uint256 id;
        uint256 tokenId;
        string name;
        string description;
        string uri;
    }

    struct Schematics{
        uint256 id;
        uint256 tokenId;
        string name;
        string description;
        string uri;
        bytes32 inputsHash;
        string [] inputs;
        string [] outputs;
    }

    struct Unit {
        uint256 id;
        uint256 tokenId;
        string name;
        uint256 level;
        uint256 generation;
        string corporation;
        string model;
        string description;
        string [] uris;
        uint256 [] values;
        string rarity;
        uint256 modSlots;
        uint256 [] mods;
    }


    event CorporationCreated(Corporation);
    event CorporationDisbanded(Corporation);
    event FactoryCreated(Factory);
    event LootCreated(Loot);
    event ModCreated(Mod);
    event SchematicsCreated(Schematics);
    event UnitCreated(Unit);


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                      CORPORATIONS                      //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////

    /// @notice Function used to create a Corporation
    /// @dev Should be callable by anyone not part of a corporation
    function createCorporation(Corporation calldata corporation) external;

    /// @notice Function used to disband a Corporation
    /// @dev Should be callable by the owner of the corporation
    function disbandCorporation(Corporation calldata corporation) external;

    /// @notice Function used to add or remove a member from a Corporation
    /// @dev Should be callable only by the owner of the corporation
    function addOrRemoveMember(address _member, uint256 _corporationId) external;


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                        FACTORIES                       //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////

    /// @notice Function to create a factory
    /// @dev Callable only by the admin
    function createFactory(Factory calldata factory) external;


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                         LOOTS                          //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////

    /// @notice Function used to create a Loot
    /// @dev Should be callable by contract admin
    function createLoot(Loot calldata loot) external;

    /// @notice Merge multiple loots to create a an item
    /// @dev Explain to a developer any extra details
    /// @param loots is an array of ids of loots to be merged
    /// @param loots is an array of amounts of loots to be merged
    function mergeLoots(uint256, uint256 [] calldata loots, uint256 [] calldata amounts) external;


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                            MODS                        //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////    

    function createMod(Mod calldata mod) external;


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                      SCHEMATICS                        //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////       

    /// @notice Function used to create a Schematics
    function createSchematics(Schematics calldata schematics) external;


    ////////////////////////////////////////////////////////////
    //                                                        //
    //                                                        //
    //                           UNITS                        //
    //                                                        //
    //                                                        //
    ////////////////////////////////////////////////////////////  

    function createUnit(Unit calldata _unit) external;

    // function addMod(uint256 unitId, uint256 modId) external;

    // function destroyMod(uint256 unitId, uint256 modId) external;

    // function switchVisual(uint256 unitId, uint256 modId) external;

}