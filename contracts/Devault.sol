pragma solidity ^0.5.0;

contract Devault {
    
    mapping(string => string) public cases;
    
    function createCase(string memory id, string memory fileHash) public returns(string memory){
        if(bytes(fileHash).length==0 || bytes(id).length==0){
            return "INVALID";
        }
        if(bytes(cases[id]).length == 0){
            cases[id] = fileHash;
            return "OK";
        }
        else{
            return "DENIED";
        }
        
    }
    
    function verify(string memory id, string memory fileHash) view public returns(string memory){
        if(bytes(cases[id]).length == 0){
            return("NONEXISTENT");
        }
        if(keccak256(bytes(cases[id]))==keccak256(bytes(fileHash))){
            return("MATCH");
        }
        else{
            return("NO MATCH");
        }
    }
    
}
