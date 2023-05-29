// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;



interface IMod {

    struct Mod{
        uint256 id;
        string name;
        string description;
        string uri;
    }

    event ModCreated(Mod);

    function createMod(Mod calldata mod) external;

}