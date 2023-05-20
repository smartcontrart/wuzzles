// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;


interface IFactory {

    struct Factory {
        uint256 id;
        string name;
        string description;
        string uri;
    }

    event FactoryCreated(Factory);

    /// @notice Function to create a factory
    /// @dev Callable only by the admin
    function createFactory(Factory calldata factory) external;

}