// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;


interface ISchematics {

    struct Schematics{
        uint256 id;
        string name;
        string description;
        string uri;
        bytes32 inputsHash;
        string [] inputs;
        string [] outputs;
    }

    event SchematicsCreated(Schematics);

    /// @notice Function used to create a Schematics
    function createSchematics(Schematics calldata schematics) external;

    function validateCraft(uint256, uint256 [] calldata loots, uint256 [] calldata amounts) external returns(bool);


}