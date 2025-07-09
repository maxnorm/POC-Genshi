// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

error Attributes_KeyAlreadySet(uint256 tokenId, string key);
error Attributes_KeyNotSet(uint256 tokenId, string key);
error Attributes_KeyAndValueCannotBeEmpty();
error Attributes_AlreadyValidated(uint256 tokenId, string key);
error Attributes_UpdateAlreadyValidated(uint256 tokenId, string key, uint256 updateId);


/// @title AttributesManagement
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the attributes of the NFTs
/// @dev This contract is used to set, update, and validate the attributes of the NFTs
contract AttributesManagement  {
  event AttributeSet(uint256 tokenId, string name, string value, address setBy);
  event AttributeUpdated(uint256 tokenId, string name, string oldValue, string newValue, address updatedBy);
  event AttributeValidated(uint256 tokenId, string name, address validator);
  event UpdateValidated(uint256 tokenId, string name, uint256 updateId, address validatedBy);

  /// @notice The attribute of the NFT
  struct Attribute {
    string value;
    string units;
    address setBy;
    address validatedBy;
    Update[] history;
    uint256 createdAt;
  }

  /// @notice The update of the attribute
  struct Update {
    uint256 id;
    string oldValue;
    string newValue;
    address updatedBy;
    address validatedBy;
    uint256 updatedAt;
    uint256 validatedAt;
  }  

  mapping(uint256 tokenId => mapping(string key => Attribute value)) public attributes;

  /// @notice Gets the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @return The attribute of the NFT
  function getAttribute(uint256 tokenId, string memory key) public view returns (Attribute memory) {
    require(attributes[tokenId][key].setBy != address(0), Attributes_KeyNotSet(tokenId, key));
    return attributes[tokenId][key];
  }

  /// @notice Sets the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @param value The value of the attribute
  /// @param units The units of the value (e.g., "mm", "MPa", "°C", "N/A")
  function _setAttribute(uint256 tokenId, string memory key, string memory value, string memory units) internal {
    require(attributes[tokenId][key].setBy == address(0), Attributes_KeyAlreadySet(tokenId, key));
    require(bytes(key).length > 0 && bytes(value).length > 0, Attributes_KeyAndValueCannotBeEmpty());

    attributes[tokenId][key] = Attribute({
      value: value,
      units: units,
      setBy: msg.sender,
      validatedBy: address(0),
      history: new Update[](0),
      createdAt: block.timestamp
    });

    attributes[tokenId][key].history.push(Update({
      id: 0,
      oldValue: "",
      newValue: value,
      updatedBy: msg.sender,
      validatedBy: address(0),
      validatedAt: 0,
      updatedAt: block.timestamp
    }));

    emit AttributeSet(tokenId, key, value, msg.sender);
  }

  /// @notice Validates the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  function _validateAttribute(uint256 tokenId, string memory key) internal {
    require(attributes[tokenId][key].setBy != address(0), Attributes_KeyNotSet(tokenId, key));
    require(attributes[tokenId][key].validatedBy == address(0), Attributes_AlreadyValidated(tokenId, key));

    attributes[tokenId][key].validatedBy = msg.sender;

    uint256 lastUpdateIdx = attributes[tokenId][key].history.length - 1;
    attributes[tokenId][key].history[lastUpdateIdx].validatedBy = msg.sender;
    attributes[tokenId][key].history[lastUpdateIdx].validatedAt = block.timestamp;

    emit AttributeValidated(tokenId, key, msg.sender);
  }

  /// @notice Updates the attribute of the NFT
  /// @param tokenId The id of the NFT
  /// @param key The key of the attribute
  /// @param value The value of the attribute
  function _updateAttribute(uint256 tokenId, string memory key, string memory value) internal {
    require(attributes[tokenId][key].setBy != address(0), Attributes_KeyNotSet(tokenId, key));
    require(bytes(key).length > 0 && bytes(value).length > 0, Attributes_KeyAndValueCannotBeEmpty());

    string memory oldValue = attributes[tokenId][key].value;

    attributes[tokenId][key].value = value;
    attributes[tokenId][key].history.push(Update({
      id: attributes[tokenId][key].history.length,
      oldValue: oldValue,
      newValue: value,
      updatedBy: msg.sender,
      validatedBy: address(0),
      validatedAt: 0,
      updatedAt: block.timestamp
    }));
    attributes[tokenId][key].validatedBy = address(0);

    emit AttributeUpdated(tokenId, key, oldValue, value, msg.sender);
  }
}