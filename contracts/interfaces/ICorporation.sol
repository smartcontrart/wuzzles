// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;


interface ICorporation {

    struct Corporation{
        uint256 id;
        uint256 tokenId;
        address owner;
        string name;
        string description;
        string uri;
    }

    event CorporationCreated(Corporation);

    /// @notice Function used to create a Corporation
    /// @dev Should be callable by anyone not part of a corporation
    function createCorporation(Corporation calldata corporation) external;

    function disbandCorporation(Corporation calldata corporation) external;

    function addMember(address _member, uint256 _corporationId) external;

}