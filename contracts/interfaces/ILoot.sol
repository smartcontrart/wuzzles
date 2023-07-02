// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface ILoot {
    struct Loot {
        uint256 id;
        string name;
        string description;
        string image;
        string animation;
        string uri;
        bool isBroken;
    }

    event LootCreated(Loot);

    /**
     * @notice Function to create a loot
     */
    function createLoot(Loot calldata loot) external;
}
