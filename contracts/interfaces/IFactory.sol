// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IFactory {
    error FactoryInUse();
    error InvalidCraft();
    error OnlyOwner();
    error RewardUnavailable();
    error TimerOngoing();
    error Unauthorized();

    struct Factory {
        uint256 id;
        string name;
        string description;
        string image;
        string animation;
        string uri;
    }

    event CraftInitiated();
    event CraftClaimed();
    event FactoryCreated(Factory);

    /// @notice Function to create a factory
    /// @dev Callable only by the admin
    function createFactory(Factory calldata factory) external;

    /// @notice Merge multiple loots to create a an item
    /// @dev Explain to a developer any extra details
    function craft(uint256 factoryId, uint256 schematicsId) external;

    function claimCraft(uint256 _tokenId) external;
}
