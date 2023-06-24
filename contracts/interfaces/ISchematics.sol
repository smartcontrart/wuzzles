// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface ISchematics {
    struct Schematics {
        uint256 id;
        string name;
        string description;
        string animation;
        string uri;
        uint256 constructionTime;
        uint256[] inputs;
        uint256[] inputAmounts;
        uint256 output;
        bool outputIsUnit;
    }

    event SchematicCreated(Schematics);

    /// @notice Function used to create a Schematics
    function createSchematic(Schematics calldata schematics) external;

    function validateCraft(
        uint256
    )
        external
        returns (uint256, bool, uint256, uint256[] memory, uint256[] memory);
}
