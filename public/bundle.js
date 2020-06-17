const devaultABI = [
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "cases",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "fileHash",
          "type": "string"
        }
      ],
      "name": "createCase",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "fileHash",
          "type": "string"
        }
      ],
      "name": "verify",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
 ];
  
const devaultAddress = "0xb36858d80278b11BEc2C2bb1e8EdEf00F00D7871";

const web3 = new Web3("http://localhost:9545");
const devault = new web3.eth.Contract(devaultABI, devaultAddress);


function computeHash(file){
	var reader = new FileReader();
	
	return new Promise((resolve, reject) => {	
		reader.onerror = function (){
			reader.abort();
			reject(new DOMException("Problem parsing input file."));
		};
		
		reader.onload = function (event) {
			var data = event.target.result;
			var fileHash = CryptoJS.SHA256(data);
			resolve(fileHash);
		};
		
		reader.readAsBinaryString(file);
	});
	
}

  
document.addEventListener('DOMContentLoaded', () => {
	$submitEvidence = document.getElementById("submitEvidence");
	$verifyEvidence = document.getElementById("verifyEvidence");
	$submitMsg = document.getElementById("submitMsg");
	$verificationMsg = document.getElementById("verificationMsg");
	
	let accounts = [];
	
	web3.eth.getAccounts()
	.then(_accounts => {
		accounts = _accounts;
	});
	
	
	$submitEvidence.addEventListener('submit', e => {
		e.preventDefault();
		
		const file = e.target.elements[1].files[0];
		const caseID = e.target.elements[0].value;
		
		
		computeHash(file).then((result) => {
			var hash = "" + result;
			devault.methods.createCase(caseID, hash).call().then(resp => {
				if(resp.localeCompare("OK")==0){
					devault.methods.createCase(caseID, hash).send({from: accounts[0]});
					$submitMsg.innerHTML = "Evidence has been sucessfully secured.";
					$submitMsg.style.color = "green";
				}
				else if(resp.localeCompare("DENIED")==0){
					$submitMsg.innerHTML = "Denied! This case already exists.";
					$submitMsg.style.color = "red";
				}
				else if(resp.localeCompare("INVALID")==0){
					$submitMsg.innerHTML = "Invalid Submission!";
					$submitMsg.style.color = "red";
				}
				else{
					$submitMsg.innerHTML = "Unknown Error!";
					$submitMsg.style.color = "red";
				}
			});
		}).catch(resp => {
			$submitMsg.innerHTML = "Invalid Submission!";
			$submitMsg.style.color = "red";
		});
		
		e.target.reset();
	});
	
	$verifyEvidence.addEventListener('submit', e => {
		e.preventDefault();
		const file = e.target.elements[1].files[0];
		const caseID = e.target.elements[0].value;
		
		computeHash(file).then((result) => {
			var hash = "" + result;
			devault.methods.verify(caseID, hash).call().then(resp => {
				if(resp.localeCompare("MATCH")==0){
					$verificationMsg.innerHTML = "Evidence integrity confirmed.";
					$verificationMsg.style.color = "green";
				}
				else if(resp.localeCompare("NO MATCH")==0){
					$verificationMsg.innerHTML = "WARNING! File has been tampered with!";
					$verificationMsg.style.color = "red";
				}
				else if(resp.localeCompare("NONEXISTENT")==0){
					$verificationMsg.innerHTML = "Case does not exist!";
					$verificationMsg.style.color = "red";
				}
				else{
					$verificationMsg.innerHTML = "Unknown Error";
					$verificationMsg.style.color = "red";
				}
			});
				
		}).catch(resp => {
			$verificationMsg.innerHTML = "Invalid Submission";
			$verificationMsg.style.color = "red";
		});
		
		e.target.reset();
	});
});