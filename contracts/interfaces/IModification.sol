// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;



interface IModification {

    struct Modification{
        uint256 id;
        string name;
        string description;
        string uri;
    }

    event ModificationCreated(Modification);

    function createModification(Modification calldata modification) external;

}