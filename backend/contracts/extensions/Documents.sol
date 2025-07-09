// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

error Document_AlreadySet(uint256 tokenId, uint256 docId, string name);
error Document_NoChangeInHash(uint256 tokenId, uint256 docId, string hash);
error InvalidDocument(uint256 tokenId, uint256 docId);
error Documents_InputsCannotBeEmpty();
error Document_AlreadyValidated(uint256 tokenId, uint256 docId);

/// @title Documents
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the documents attached to the NFTs
/// @dev This contract is used to set, update, and validate documents
contract Documents {
  uint256 private _count;

  event DocumentSet(uint256 tokenId, uint256 docId, string name, string uri);
  event DocumentUpdated(uint256 tokenId, uint256 docId, string name, string uri, uint256 version);
  event DocumentValidated(uint256 tokenId, uint256 docId, string name, string uri);

  /// @notice Document attached to the NFT
  struct Document {
    uint256 id;
    string name;
    string uri;
    string hash;
    string mimeType;
    string description;
    Version[] history;
    address validatedBy;
    uint256 validatedAt;
    address createdBy;
    uint256 createdAt;
  }

  struct Version {
    uint256 id;
    string oldUri;
    string newUri;
    string newHash;
    string newMimeType;
    string newDescription;
    address updatedBy;
    address validatedBy;
    uint256 validatedAt;
    uint256 updatedAt;
  }

  mapping(uint256 tokenId => mapping(uint256 id => Document document)) public documents;

  function getDocument(uint256 tokenId, uint256 docId) public view returns (Document memory) {
    require(documents[tokenId][docId].createdBy != address(0), InvalidDocument(tokenId, docId));
    return documents[tokenId][docId];
  }

  /// @notice Sets a document to the NFT
  /// @param tokenId The id of the NFT
  /// @param name The name of the document
  /// @param description The description of the document
  /// @param uri The uri of the document
  /// @param hash The hash of the document
  /// @param mimeType The mime type of the document
  function _setDocument(
    uint256 tokenId, 
    string memory name, 
    string memory description,
    string memory uri, 
    string memory hash,
    string memory mimeType) internal {
    require(
      bytes(name).length > 0 &&
      bytes(description).length > 0 &&
      bytes(uri).length > 0 &&
      bytes(hash).length > 0 &&
      bytes(mimeType).length > 0,
      Documents_InputsCannotBeEmpty()
    );
    _count++;

    documents[tokenId][_count] = Document({
      id: _count,
      name: name,
      uri: uri,
      hash: hash,
      mimeType: mimeType,
      description: description,
      issuedBy: msg.sender,
      history: new Version[](0),
      validatedBy: address(0),
      validatedAt: 0,
      createdAt: block.timestamp
    });

    documents[tokenId][_count].history.push(Version({
      id: documents[tokenId][_count].history.length,
      oldUri: "",
      newUri: uri,
      newHash: hash,
      newMimeType: mimeType,
      newDescription: description,
      updatedBy: msg.sender,
      validatedBy: address(0),
      validatedAt: 0,
      updatedAt: block.timestamp
    }));

    emit DocumentSet(tokenId, _count, name, uri);
  }

  /// @notice Updates a document of the NFT
  /// @param tokenId The id of the NFT
  /// @param docId The id of the document
  /// @param name The name of the document
  /// @param description The description of the document
  /// @param uri The uri of the document
  /// @param hash The hash of the document
  function _updateDocument(
    uint256 tokenId,
    uint256 docId,
    string memory name,
    string memory description,
    string memory uri,
    string memory hash,
    string memory mimeType) internal {
    require(
      bytes(name).length > 0 &&
      bytes(description).length > 0 &&
      bytes(uri).length > 0 &&
      bytes(hash).length > 0 &&
      bytes(mimeType).length > 0,
      Documents_InputsCannotBeEmpty()
    );
    require(documents[tokenId][docId].createdBy != address(0), InvalidDocument(tokenId, docId));
    require(documents[tokenId][docId].hash != hash, Document_NoChangeInHash(tokenId, docId, hash));

    Document storage document = documents[tokenId][docId];

    string memory oldUri = document.uri;

    document.uri = uri;
    document.hash = hash;
    document.mimeType = mimeType;
    document.description = description;

    document.history.push(Version({
      id: document.history.length,
      oldUri: oldUri,
      newUri: uri,
      newHash: hash,
      newMimeType: mimeType,
      newDescription: description,
      updatedBy: msg.sender,
      validatedBy: address(0), 
      validatedAt: 0,
      updatedAt: block.timestamp
    }));

    document.validatedBy = address(0);

    emit DocumentUpdated(tokenId, docId, name, uri, document.history.length);
  }

  /// @notice Validates the document of the NFT
  /// @param tokenId The id of the NFT
  /// @param docId The id of the document
  function _validateDocument(uint256 tokenId, uint256 docId) internal {
    require(documents[tokenId][docId].createdBy != address(0), InvalidDocument(tokenId, docId));
    require(documents[tokenId][docId].validatedBy == address(0), Document_AlreadyValidated(tokenId, docId));

    Document storage document = documents[tokenId][docId];

    document.validatedBy = msg.sender;

    uint256 lastUpdateIdx = document.history.length - 1;
    document.history[lastUpdateIdx].validatedBy = msg.sender;
    document.history[lastUpdateIdx].validatedAt = block.timestamp;

    emit DocumentValidated(tokenId, docId, document.name, document.uri);
  }
}