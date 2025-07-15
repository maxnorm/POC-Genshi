pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../ChildValidator.sol";

contract SampleParentWithChildValidator is ERC721, ChildContractValidator {
    uint256 private _count;

    constructor(address[] memory allowedChildren) 
        ERC721("SampleParentWithChildValidator", "SPC") 
        ChildContractValidator(allowedChildren){}

    function mint() public returns (uint256) {
        _count++;
        _safeMint(msg.sender, _count);
        return _count;
    }

    function validateChildContract(address childContract) public view {
        _validateChild(childContract);
    }
}
