// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interface/IERC998ERC721TopDown.sol";
import "./interface/IERC998ERC721TopDownEnumerable.sol";
import "./interface/IERC998ERC20TopDown.sol";
import "./interface/IERC998ERC20TopDownEnumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";


error ERC998TopDownEnumerable_InvalidContractIndex(uint256 _tokenId, uint256 _index);
error ERC998TopDownEnumerable_InvalidTokenIndex(uint256 _tokenId, address _childContract, uint256 _index);
error ERC998TopDown_HasNoRootOwner(uint256 _tokenId);
error ERC998TopDown_CallerIsNotOwnerNorApprovedOperator(uint256 _tokenId);
error ERC998TopDown_ApprovalToCurrentOwner(uint256 _tokenId);
error ERC998TopDown_ChildTokenAlreadyExists(uint256 _tokenId, address _childContract, uint256 _childTokenId);
error ERC998TopDown_InvalidReceiver(address _to);
error ERC998TopDown_InvalidFromTokenId(uint256 _fromTokenId, uint256 _tokenId);
error ERC998TopDown_ChildContractNotFound(address _childContract);
error ERC998TopDown_ChildTokenNotFound(address _childContract, uint256 _childTokenId);
error ERC998TopDown_InvalidChildContract(address _childContract);

/// @title ERC998TopDown
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice ERC998TopDown is a contract that implements the ERC998TopDown interface.
/// @notice This contract is a updated version of the ERC998TopDown contract by Nick Mudge <nick@perfectabstractions.com>,
/// @notice Original implementation: https://github.com/mattlockyer/composables-998/blob/master/contracts/ERC998TopDown.sol
/// @dev This contract is used to create a top-down composable NFT with ERC721. 
/// @dev ERC20 support will be added later (IERC998ERC20TopDown & IERC998ERC20TopDownEnumerable)
abstract contract ERC998TopDown is
  ERC721, 
  IERC721Receiver,
  IERC998ERC721TopDown, 
  IERC998ERC721TopDownEnumerable,
  ReentrancyGuard
{
  /// @notice ERC998 magic value for root ownership identification
  /// @notice This value was taken from the original implementation
  /// @dev return this.rootOwnerOf.selector ^ this.rootOwnerOfChild.selector ^ this.tokenOwnerOf.selector ^ this.ownerOfChild.selector;
  bytes32 constant ERC998_MAGIC_VALUE = IERC998ERC721TopDown.rootOwnerOf.selector ^ IERC998ERC721TopDown.rootOwnerOfChild.selector ^ IERC998ERC721TopDown.ownerOfChild.selector;
  
  /// @notice Interface ID for IERC721Receiver
  bytes4 private constant _ERC721_RECEIVED = IERC721Receiver.onERC721Received.selector;

  /// @notice Structure to hold all composable data for a token
  struct TokenData {
    /// @notice ERC721 Management
    address[] erc721Contracts;
    mapping(address erc721childContract => uint256 index) erc721childContractIndex;
    mapping(address erc721Contract => uint256[] childTokenIds) erc721ChildTokenIds;
    mapping(address erc721Contract => mapping(uint256 childTokenId => uint256 index)) erc721ChildTokenIndex;


    /// @notice ERC20 Management
    address[] erc20Contracts;
    mapping(address erc20Contract => uint256 balance) erc20Balances;
  }

  /// @notice Mapping from token ID to its composable data
  mapping(uint256 tokenId => TokenData) private _tokenData;

  /// @notice Mapping from root owner to its allowance
  mapping(address rootOwner => mapping(uint256 childTokenId => address approvedAddress)) internal _rootOwnerTokenApprovals;

  /// @notice Mapping to track which parent owns which child
  mapping(address childContract => mapping(uint256 childTokenId => uint256 parentTokenId)) internal _childTokenOwner;

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

  function mint(address _to, uint256 _tokenId) external virtual returns (uint256) {
    _mint(_to, _tokenId);
    return _tokenId;
  }

  // ========================================================
  // Approval Functions based on ERC721 & the Root Owner
  // ========================================================

  /// @notice Approve an address to transfer a child token
  /// @param _to The address to approve
  /// @param _tokenId The token ID of the parent token
  /// @dev This function is used to approve an address to transfer a child token
  function approve(address _to, uint256 _tokenId) public virtual override(ERC721) {
    address owner = _requireOwned(_tokenId);
    address rootOwner = _getRootOwnerAddress(_tokenId);
    require(rootOwner != address(0), ERC998TopDown_HasNoRootOwner(_tokenId));
    require(
      msg.sender == rootOwner || 
      super.isApprovedForAll(rootOwner, msg.sender) ||
      _rootOwnerTokenApprovals[rootOwner][_tokenId] == msg.sender,
      ERC998TopDown_CallerIsNotOwnerNorApprovedOperator(_tokenId)
    );
    require(_to != rootOwner, ERC998TopDown_ApprovalToCurrentOwner(_tokenId));
        
    _rootOwnerTokenApprovals[rootOwner][_tokenId] = _to;
    emit Approval(rootOwner, _to, _tokenId);
  }

  /// @notice Get the approved address for a child token
  /// @param _tokenId The token ID of the parent token
  /// @return The approved address
  function getApproved(uint256 _tokenId) public view virtual override(ERC721) returns (address) {
    _requireOwned(_tokenId);
    address rootOwner = _getRootOwnerAddress(_tokenId);
    return _rootOwnerTokenApprovals[rootOwner][_tokenId];
  }

  // ========================================================
  // IERC998ERC721TopDown Implementation 
  // ========================================================
  
  /// @notice Get the root owner of a token (the ultimate owner in the composable hierarchy)
  /// @param _tokenId The token ID to check
  /// @return rootOwner The root owner encoded as bytes32
  function rootOwnerOf(uint256 _tokenId) public view returns (bytes32 rootOwner) {
    return rootOwnerOfChild(address(0), _tokenId);
  }

  /// @notice Get the owner at the top of the tree of composables
  /// @notice Use Cases handled:
  /// @notice Case 1: Token owner is this contract and token.
  /// @notice Case 2: Token owner is other top-down composable
  /// @notice Case 3: Token owner is other contract
  /// @notice Case 4: Token owner is user
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @return rootOwner The root owner encoded as bytes32
  function rootOwnerOfChild(address _childContract, uint256 _childTokenId) public view returns (bytes32 rootOwner) {
    address currentOwner;
    uint256 currentTokenId = _childTokenId;

    // Determine initial owner based on whether we're querying a direct token or child token
    if (_childContract != address(0)) {
      (currentOwner, currentTokenId) = _ownerOfChild(_childContract, _childTokenId);
    } else {
      currentOwner = ownerOf(_childTokenId);
    }

    // Case 1: Handle self-ownership loop - traverse up hierarchy until we find external owner
    while (currentOwner == address(this)) {
      (currentOwner, currentTokenId) = _ownerOfChild(address(this), currentTokenId);
    }

    // Try to call rootOwnerOfChild on the current owner to check if it's another composable
    // Function selector for rootOwnerOfChild(address,uint256): 0xed81cdda
    bytes memory callData = abi.encodeWithSelector(0xed81cdda, address(this), currentTokenId);
    bool callSuccess;
    assembly {
      callSuccess := staticcall(gas(), currentOwner, add(callData, 0x20), mload(callData), callData, 0x20)
      if callSuccess {
        rootOwner := mload(callData)
      }
    }
    
    // Case 2: If call succeeds and has correct magic value, owner is another composable
    if (callSuccess && rootOwner >> 224 == ERC998_MAGIC_VALUE) {
      return rootOwner;
    }
    
    // Case 3 & 4: Owner is either another contract or a user
    // Return the magic value combined with the owner address
    return _addressToBytes32(currentOwner);
  }

  /// @notice Transfer a child token to another address
  /// @param _fromTokenId The token ID of the parent token
  /// @param _to The address to transfer the child token to
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @dev This function is used to transfer a child token to another address
  function transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) public nonReentrant {
    require(_to != address(0), ERC998TopDown_InvalidReceiver(_to));

    uint256 parentTokenId = _childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId == _fromTokenId, ERC998TopDown_InvalidFromTokenId(_fromTokenId, parentTokenId));

    TokenData storage tokenData = _tokenData[parentTokenId];
    require(tokenData.erc721ChildTokenIds[_childContract].length > 0, ERC998TopDown_ChildContractNotFound(_childContract));
    require(tokenData.erc721ChildTokenIndex[_childContract][_childTokenId] > 0, ERC998TopDown_ChildTokenNotFound(_childContract, _childTokenId));

    address rootOwner = _bytes32ToAddress(rootOwnerOf(parentTokenId));
    require(
      rootOwner == msg.sender || 
      super.isApprovedForAll(rootOwner, msg.sender) ||
      _rootOwnerTokenApprovals[rootOwner][parentTokenId] == msg.sender,
      ERC998TopDown_CallerIsNotOwnerNorApprovedOperator(parentTokenId)
    );

    _removeChild(parentTokenId, _childContract, _childTokenId);
    ERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
    emit TransferChild(parentTokenId, _to, _childContract, _childTokenId);
  }

  /// @notice Safe transfer a child token to another address
  /// @param _fromTokenId The token ID of the parent token
  /// @param _to The address to transfer the child token to
  /// @param _childContract The child contract address  
  /// @param _childTokenId The child token ID
  function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) public {
    safeTransferChild(_fromTokenId, _to, _childContract, _childTokenId, "");
  }

  /// @notice Safe transfer a child token to another address with data
  /// @param _fromTokenId The token ID of the parent token
  /// @param _to The address to transfer the child token to
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @param _data Additional data to be passed to the child contract's onERC721Received function
  function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId, bytes memory _data) public virtual nonReentrant {
    transferChild(_fromTokenId, _to, _childContract, _childTokenId);
    ERC721Utils.checkOnERC721Received(msg.sender, address(this), _to, _childTokenId, _data);
  }

  /// @notice Transfer a child token to a parent token
  /// @param _fromTokenId The token ID of the parent token
  /// @param _toContract The address of the parent token
  /// @param _toTokenId The token ID of the parent token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  function transferChildToParent(uint256 _fromTokenId, address _toContract, uint256 _toTokenId, address _childContract, uint256 _childTokenId, bytes calldata _data) external nonReentrant {
    require(_toContract != address(0), ERC998TopDown_InvalidReceiver(_toContract));

    uint256 parentTokenId = _childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId == _fromTokenId, ERC998TopDown_InvalidFromTokenId(_fromTokenId, parentTokenId));

    TokenData storage tokenData = _tokenData[parentTokenId];
    require(tokenData.erc721ChildTokenIds[_childContract].length > 0, ERC998TopDown_ChildContractNotFound(_childContract));
    require(tokenData.erc721ChildTokenIndex[_childContract][_childTokenId] > 0, ERC998TopDown_ChildTokenNotFound(_childContract, _childTokenId));

    address rootOwner = _bytes32ToAddress(rootOwnerOf(parentTokenId));
    require(
      rootOwner == msg.sender || 
      super.isApprovedForAll(rootOwner, msg.sender) ||
      _rootOwnerTokenApprovals[rootOwner][parentTokenId] == msg.sender,
      ERC998TopDown_CallerIsNotOwnerNorApprovedOperator(parentTokenId)
    );

    _removeChild(parentTokenId, _childContract, _childTokenId);
    ERC721(_childContract).safeTransferFrom(
        address(this), 
        _toContract, 
        _childTokenId,
        abi.encode(_toTokenId)
    );
    emit TransferChild(parentTokenId, _toContract, _childContract, _childTokenId);
  }

  /// @notice Get a child token from another contract
  /// @notice Child contract must approve this contract to transfer the child token to this contract
  /// @param _from The address that sent the child token
  /// @param _tokenId The token ID of the parent token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @dev This function is used to get a child token from another ERC721 contract
  /// @dev Enables older contracts like cryptokitties to be transferred into a composable
  function getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external nonReentrant {
    _receiveChild(_from, _tokenId, _childContract, _childTokenId);
    require(
      _from == msg.sender ||
      ERC721(_childContract).isApprovedForAll(_from, msg.sender) ||
      ERC721(_childContract).getApproved(_childTokenId) == msg.sender,
      ERC998TopDown_CallerIsNotOwnerNorApprovedOperator(_tokenId)
    );
    ERC721(_childContract).transferFrom(_from, address(this), _childTokenId);
  }

  /// @notice Check if a child token exists
  /// @param _tokenId The token ID of the parent token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @return True if the child token exists, false otherwise
  function childExists(uint256 _tokenId, address _childContract, uint256 _childTokenId) external view returns (bool) {
    return _tokenData[_tokenId].erc721ChildTokenIndex[_childContract][_childTokenId] > 0;
  }

  /// @notice Get the owner of a child token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @return parentTokenOwner The owner of the parent token encoded as bytes32
  /// @return parentTokenId The ID of the parent token
  function ownerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 parentTokenOwner, uint256 parentTokenId) {
    parentTokenId = _childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId > 0 || _childTokenOwner[address(this)][parentTokenId] > 0);
    return (_addressToBytes32(ownerOf(parentTokenId)), parentTokenId);
  }

  /// @notice Get the owner of a child token (internal function)
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @return parentTokenOwner The owner of the parent token
  /// @return parentTokenId The ID of the parent token
  function _ownerOfChild(address _childContract, uint256 _childTokenId) internal view returns (address parentTokenOwner, uint256 parentTokenId) {
    parentTokenId = _childTokenOwner[_childContract][_childTokenId];
    require(parentTokenId > 0 || _childTokenOwner[address(this)][parentTokenId] > 0);
    return (ownerOf(parentTokenId), parentTokenId);
  }

  /// @notice Receive a child token from another contract
  /// @param _from The address that sent the child token
  /// @param _tokenId The token ID of the parent token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @dev This function is used to receive a child token from another contract
  function _receiveChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
    _requireOwned(_tokenId);
    require(
      _tokenData[_tokenId].erc721ChildTokenIds[_childContract][_childTokenId] == 0, 
      ERC998TopDown_ChildTokenAlreadyExists(_tokenId, _childContract, _childTokenId)
    );
    uint256 childTokensLength = _tokenData[_tokenId].erc721ChildTokenIds[_childContract].length;
    if (childTokensLength == 0) {
      _tokenData[_tokenId].erc721childContractIndex[_childContract] = _tokenData[_tokenId].erc721Contracts.length;
      _tokenData[_tokenId].erc721Contracts.push(_childContract);
    } 
    _tokenData[_tokenId].erc721ChildTokenIds[_childContract].push(_childTokenId);
    _tokenData[_tokenId].erc721ChildTokenIndex[_childContract][_childTokenId] = childTokensLength + 1;
    _childTokenOwner[_childContract][_childTokenId] = _tokenId;
    emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId);
  }

  /// @notice Remove a child token from a parent token
  /// @param _tokenId The token ID of the parent token
  /// @param _childContract The child contract address
  /// @param _childTokenId The child token ID
  /// @dev This function is used to remove a child token from a parent token
  function _removeChild(uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
    TokenData storage tokenData = _tokenData[_tokenId];
     
    uint256 tokenIndex = tokenData.erc721ChildTokenIndex[_childContract][_childTokenId];
    require(tokenIndex > 0, ERC998TopDown_ChildTokenNotFound(_childContract, _childTokenId));

    uint256 lastTokenIndex = tokenData.erc721ChildTokenIds[_childContract].length - 1;
    uint256 lastTokenId = tokenData.erc721ChildTokenIds[_childContract][lastTokenIndex];

    // Token Swap Logic if we are not removing the last token
    if (_childTokenId != lastTokenId) {
      tokenData.erc721ChildTokenIds[_childContract][tokenIndex - 1] = lastTokenId;
      tokenData.erc721ChildTokenIndex[_childContract][lastTokenId] = tokenIndex;
    }

    tokenData.erc721ChildTokenIds[_childContract].pop();
    delete tokenData.erc721ChildTokenIndex[_childContract][_childTokenId];
    delete _childTokenOwner[_childContract][_childTokenId];

    if (lastTokenIndex == 0) {
      uint256 contractIndex = tokenData.erc721childContractIndex[_childContract];
      uint256 lastContractIndex = tokenData.erc721Contracts.length - 1;
      address lastContract = tokenData.erc721Contracts[lastContractIndex];

      if (_childContract != lastContract) {
        tokenData.erc721Contracts[contractIndex] = lastContract;
        tokenData.erc721childContractIndex[lastContract] = contractIndex;
      }

      tokenData.erc721Contracts.pop();
      delete tokenData.erc721childContractIndex[_childContract];
    }
  }

  /// @notice Get the root owner address from bytes32 root owner value
  /// @dev Extracts address from magic value + address combination
  function _getRootOwnerAddress(uint256 _tokenId) internal view returns (address) {
    return _bytes32ToAddress(rootOwnerOf(_tokenId));
  }

  // ========================================================
  // IERC998ERC721TopDownEnumerable Implementation
  // ========================================================

  /// @notice Get the total number of child contracts for a token
  /// @param _tokenId The parent token ID
  /// @return The number of child contracts
  function totalChildContracts(uint256 _tokenId) external view returns (uint256 ) {
    return _tokenData[_tokenId].erc721Contracts.length;
  }

  function childContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address childContract) {
    require(_index < _tokenData[_tokenId].erc721Contracts.length, ERC998TopDownEnumerable_InvalidContractIndex(_tokenId, _index));
    return _tokenData[_tokenId].erc721Contracts[_index];
  }

  /// @notice Get the total number of child tokens for a specific contract
  /// @param _tokenId The parent token ID
  /// @param _childContract The child contract address
  /// @return The number of child tokens
  function totalChildTokens(uint256 _tokenId, address _childContract) external view returns (uint256) {
    return _tokenData[_tokenId].erc721ChildTokenIds[_childContract].length;
  }

  function childTokenByIndex(uint256 _tokenId, address _childContract, uint256 _index) external view returns (uint256 childTokenId) {
    require(_index < _tokenData[_tokenId].erc721ChildTokenIds[_childContract].length, ERC998TopDownEnumerable_InvalidTokenIndex(_tokenId, _childContract, _index));
    return _tokenData[_tokenId].erc721ChildTokenIds[_childContract][_index];
  }

  // ========================================================
  // IERC998ERC20TopDown Implementation - TODO: Implement Later
  // ========================================================

  /**
  function tokenFallback(address _from, uint256 _value, bytes calldata _data) external;
  function balanceOfERC20(uint256 _tokenId, address __erc20Contract) external view returns (uint256);
  function transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external;
  function getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) external;
  */

  // ========================================================
  // IERC998ERC20TopDownEnumerable Implementation - TODO: Implement Later
  // ========================================================

  /**
  /// @notice Get the total number of ERC20 contracts for a token
  /// @param _tokenId The parent token ID
  /// @return The number of ERC20 contracts
  function totalERC20Contracts(uint256 _tokenId) external view returns (uint256) {
    return _tokenData[_tokenId].erc20Contracts.length;
  }

  function erc20ContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address);
  */

  // ========================================================
  // IERC165 Implementation 
  // ========================================================

  /// @notice Check if the contract supports an interface
  /// @param _interfaceId The interface ID to check
  /// @return True if the interface is supported
  function supportsInterface(bytes4 _interfaceId) public view virtual override(ERC721) returns (bool) 
  {
    return _interfaceId == type(IERC998ERC721TopDown).interfaceId ||
        _interfaceId == type(IERC998ERC721TopDownEnumerable).interfaceId ||
        _interfaceId == type(IERC998ERC20TopDown).interfaceId ||
        _interfaceId == type(IERC998ERC20TopDownEnumerable).interfaceId ||
        _interfaceId == type(IERC721Receiver).interfaceId ||
        super.supportsInterface(_interfaceId);
  }

  // ========================================================
  // IERC721Receiver Implementation 
  // ========================================================

  /// @notice Handle the receipt of an NFT
  /// @param _operator The address which called `safeTransferFrom` function
  /// @param _from The address which previously owned the token
  /// @param _childTokenId The NFT identifier which is being transferred
  /// @param _data Additional data with no specified format
  /// @return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))
  function onERC721Received(address _operator, address _from, uint256 _childTokenId, bytes calldata _data) 
    external 
    nonReentrant 
    override(IERC721Receiver, IERC998ERC721TopDown)
    returns (bytes4) 
  {
    uint256 parentTokenId = abi.decode(_data, (uint256));
    _requireOwned(parentTokenId);
    _receiveChild(_from, parentTokenId, msg.sender, _childTokenId);
    return _ERC721_RECEIVED;
  }

  // ========================================================
  // Internal Helper Functions
  // ========================================================

  /// @dev Converts an address to bytes32 with magic value
  /// @param _addr The address to convert
  /// @return The bytes32 value with magic value
  function _addressToBytes32(address _addr) internal pure returns (bytes32) {
    return ERC998_MAGIC_VALUE << 224 | bytes32(uint256(uint160(_addr)));
  }

  /// @dev Extracts address from bytes32 that contains magic value
  /// @param _data The bytes32 value to convert
  /// @return The address extracted from the bytes32 value
  function _bytes32ToAddress(bytes32 _data) internal pure returns (address) {
    return address(uint160(uint256(_data)));
  }
}