// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;



interface ILoot {

    struct Loot {
        uint256 id;
        string name;
        string description;
        string uri;
        bool isBroken;
    }

    event LootCreated(Loot);

    /**
     * @notice Function to create a loot
     */
    function createLoot(Loot calldata loot) external;


    /// @notice Merge multiple loots to create a an item
    /// @dev Explain to a developer any extra details
    /// @param loots is an array of ids of loots to be merged
    // function mergeLoots(uint256[] calldata loots) external;

}