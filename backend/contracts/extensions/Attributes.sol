// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

error Attributes_KeyAlreadySet(uint256 tokenId, string key);
error Attributes_InvalidKey(uint256 tokenId, string key);
error Attributes_InputsCannotBeEmpty();
error Attributes_AlreadyValidated(uint256 tokenId, string key);
error Attributes_UpdateAlreadyValidated(uint256 tokenId, string key, uint256 updateId);


/// @title AttributesManagement
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the attributes of the NFTs
/// @dev This contract is used to set, update, and validate attributes
contract Attributes  {
  event AttributeSet(uint256 tokenId, string key, string value, address createdBy);
  event AttributeUpdated(uint256 tokenId, string key, string oldValue, string newValue, address updatedBy);
  event AttributeValidated(uint256 tokenId, string key, address validator, uint256 updateId);

  /// @notice The attribute of the NFT
  struct Attribute {
    string value;
    Update[] history;
    address lastValidator;
    uint256 lastValidatedAt;
    address createdBy;
    uint256 createdAt;
  }

  /// @notice The update of the attribute
  struct Update {
    uint256 id;
    string oldValue;
    string newValue;
    address updatedBy;
    uint256 updatedAt;
    address validatedBy;
    uint256 validatedAt;
  }  

  mapping(uint256 tokenId => mapping(string key => Attribute value)) public attributes;

  /// @notice Gets the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @return The attribute of the NFT
  function getAttribute(uint256 tokenId, string memory key) public view returns (Attribute memory) {
    require(attributes[tokenId][key].createdBy != address(0), Attributes_InvalidKey(tokenId, key));
    return attributes[tokenId][key];
  }

  /// @notice Sets the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @param value The value of the attribute
  /// @param units The units of the value (e.g., "mm", "MPa", "°C", "N/A")
  function _setAttribute(uint256 tokenId, string memory key, string memory value, string memory units) internal {
    require(bytes(key).length > 0 && bytes(value).length > 0, Attributes_InputsCannotBeEmpty());
    require(attributes[tokenId][key].createdBy == address(0), Attributes_KeyAlreadySet(tokenId, key));

    attributes[tokenId][key] = Attribute({
      value: value,
      history: new Update[](0),
      lastValidator: address(0),
      lastValidatedAt: 0,
      createdBy: msg.sender,
      createdAt: block.timestamp
    });

    attributes[tokenId][key].history.push(Update({
      id: attributes[tokenId][key].history.length,
      oldValue: "",
      newValue: value,
      updatedBy: msg.sender,
      validatedBy: address(0),
      validatedAt: 0,
      updatedAt: block.timestamp
    }));

    emit AttributeSet(tokenId, key, value, msg.sender);
  }

  /// @notice Updates the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @param value The value of the attribute
  function _updateAttribute(uint256 tokenId, string memory key, string memory value) internal {
    require(bytes(key).length > 0 && bytes(value).length > 0, Attributes_InputsCannotBeEmpty());
    require(attributes[tokenId][key].createdBy != address(0), Attributes_InvalidKey(tokenId, key));

    Attribute storage attribute = attributes[tokenId][key];

    string memory oldValue = attribute.value;

    attribute.value = value;
    attribute.history.push(Update({
      id: attribute.history.length,
      oldValue: oldValue,
      newValue: value,
      updatedBy: msg.sender,
      validatedBy: address(0),
      validatedAt: 0,
      updatedAt: block.timestamp
    }));

    attribute.lastValidator = address(0);

    emit AttributeUpdated(tokenId, key, oldValue, value, msg.sender);
  }

  /// @notice Validates the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  function _validateAttribute(uint256 tokenId, string memory key) internal {
    require(attributes[tokenId][key].createdBy != address(0), Attributes_InvalidKey(tokenId, key));
    require(attributes[tokenId][key].lastValidator == address(0), Attributes_AlreadyValidated(tokenId, key));

    Attribute storage attribute = attributes[tokenId][key];

    attribute.lastValidator = msg.sender;
    attribute.lastValidatedAt = block.timestamp;

    uint256 lastUpdateIdx = attribute.history.length - 1;
    attribute.history[lastUpdateIdx].validatedBy = msg.sender;
    attribute.history[lastUpdateIdx].validatedAt = block.timestamp;

    emit AttributeValidated(tokenId, key, msg.sender, lastUpdateIdx);
  }
}