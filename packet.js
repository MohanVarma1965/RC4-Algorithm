
/*This convets the data to binary and the empty values 
will be padded by 1 followed by0 and converts the data to the original message and
sends back the packet to the main method
*/
function prepareLastDataSetOfMessage(input) {
    var output = "";
    var append = "";

    // Prepares a set of 2016 0's that will be appended to the last data element
    for (var i = 0; i < 2016; i++) {
        append = append + 0;
    }

    //converts each byte into bits and returns bit vales in groups of 8
    for (var i = 0; i < input.length; i++) {
        output += ('00000000' + (input[i].charCodeAt(0).toString(2))).slice(-8);
    }

    //Appends 1 infront of message and appends respective zeros to the empty space
    var finalValue = 1 + (append + output).slice(-2015);
    var lastDataPacket = "";
    //Divides the data into groups of 8to reconvert to the original message
    var finalValuePairs = finalValue.match(/.{1,8}/g);

    //Reconvertion of data to original message
    for (var i = 0; i < finalValuePairs.length; i++) {
        lastDataPacket += String.fromCharCode(parseInt(finalValuePairs[i], 2).toString(10));
    }

    return lastDataPacket
}

/*
This method Divides the data into packets and 
adds 1 followed by 0s to last empty packet
and also used MD5 hashing function to get the hash values
then adds sequence counter and resends the data back*/
function convertiontoPackets(message) {

    // To divide the data into 252 bytes of messages each
    var messageArray = message.match(/.{1,252}/g);

    //Identifies the last data set
    var lastDatasetOfMessage = messageArray[messageArray.length - 1];
    var modLastDatasetOfMessage;

    // If the last data set length is less than 252 then this method adds the required padding to the data 
    if (lastDatasetOfMessage.length < 252) {
        modLastDatasetOfMessage = prepareLastDataSetOfMessage(lastDatasetOfMessage);
    }

    // Overrides the last packet data with the padded data
    messageArray[messageArray.length - 1] = modLastDatasetOfMessage;

    //Initializing the hash values array
    var hashValues = [];

    //Iterating over the array of data to append the has values to each data set
    messageArray.forEach(function(dataSet) {

        //using the MD5 algorithum to get the hash value for each block of 252 byte data
        var hashValue = MD5(dataSet).substring(0, 16);
        console.log(hashValue);

        //Adding the hashvalues to array
        hashValues.push(hashValue);

    })
    return dataPrep(messageArray, hashValues)
}

//Prepares the data with hashvalues to send for the encryption
function dataPrep(messagePacket, hashValues) {
    var finalPackets = {};
    messagePacket.forEach(function(message, i) {
        finalPackets[i] = message + hashValues[i]
    })
    return finalPackets;
}

// This sender method will encrypt the data using KSA and PRGA; RC4; and appends the data to the DOM elemnt 
function sender (dataPacket,key, encDiv) {

    //This DOM element is used to check testing case or not
    var testingCheck = document.getElementById("testing").checked;
    var case2Check = document.getElementById("case2").checked;
    var case3Check = document.getElementById("case3").checked;

    var encryptedDataObject = {};

        if(!testingCheck){
            //Iterating the datapacket to encrypt each packet of data with hashvalue
            for (prop in dataPacket) {

                //The below step gives us the RC4 encryption
                var encryptedData = rc4(key, dataPacket[prop]);
                encryptedDataObject[prop] = encryptedData;
                console.log("encryptedData for i =" + prop)
                console.log(encryptedData);
                //This string is appended to the DOM element
                var displayString = encryptedData.split('').map((char) => (char.charCodeAt(0).toString(16))).join('');
                //Creates a new p elemnt to add to the DOM element
                var para = document.createElement("p");
                //Adding data to the p tag
                var node = document.createTextNode("encryptedData >>>>>>   " + displayString);
                para.appendChild(node);
                encDiv.appendChild(para);
                
            }
            return encryptedDataObject;
        } else {
             //This loop is for testing case, i want  to keep the normal code and testing code seperate
            // Because the above code is dyamic so didn't want to change the code   
             var localObject = {};
             var localKey="";   
            //case 2: 1, 0, 3 and 2
             for (var i=0 ; i< (Object.keys(dataPacket)).length ; i++ ){
                var encryptedData = rc4(key, dataPacket[i]);

                // choosing the case 2 check
                if(case2Check) {
                    i==0? localKey=1 : (i==1 ? localKey=0 : (i==2 ? localKey=3 :localKey=2))
                }

                // choosing the case 3 check
                else if (case3Check) {
                    i==0? localKey=3 : (i==1 ? localKey=2 : (i==2 ? localKey=1 :localKey=0))
                }
                else {
                //default to case 2 
                 i==0? localKey=1 : (i==1 ? localKey=0 : (i==2 ? localKey=3 :localKey=2))   
                }
                debugger;
                localObject[localKey] = encryptedData;
                //encryptedDataObject[i] = {k: encryptedData};
            }
            debugger
            return localObject;            
        }
}

//This function decryts the data and clips the hashvalue and appends the resultant data to the DOM node
function receiver(encryptedDataObject, key) {

    //This DOM element is used to append decrypted text
    var decrptDomDiv = document.getElementById("decrypting");
    //This DOM element is used to check testing case or not
    
    var testingCheck = document.getElementById("testing").checked;
    var case2Check = document.getElementById("case2").checked;
    var case3Check = document.getElementById("case3").checked;

    //Adding the output string to the DOM
    var caseValue  =  testingCheck ? (case2Check ? "1032" : (case3Check ? "3210" : "1032")) :"0123"
    decrptDomDiv.innerHTML = "";
    //Iterating over the encrypt object to displayh in DOM
    for (prop in encryptedDataObject) {

        decryptedData = rc4(key, encryptedDataObject[prop])
        decryptedData = decryptedData.slice(0, -16);


        var localTest = testingCheck ? ((case2Check ? (prop ==2) : case3Check ? (prop==0) : false )) : (prop == Object.keys(encryptedDataObject).length - 1)
        /*if (prop == Object.keys(encryptedDataObject).length - 1) {*/
            if(localTest) {
            
            var test = "";

            var output = "";
            for (var i = 0; i < decryptedData.length; i++) {

                //Adding the values which are greater than 0 in order to avoid some special characters in string
                if (('00000000' + (decryptedData[i].charCodeAt(0).toString(2))).slice(-8) > 0) {
                    output += (('00000000' + (decryptedData[i].charCodeAt(0).toString(2))).slice(-8))
                }
            }

            var initialBitValue= "1";
            //Iterating to get 63 o's inorder to check condition in below loop
            for (var i =0; i<63; i++) {
                initialBitValue+=0;       
            }

            if (output.indexOf('10000000') != -1) {
                var finalValuePairs = output.match(/.{1,64}/g);
                for (var i = 0; i < finalValuePairs.length; i++) {
                    if (finalValuePairs[i] > 0 && finalValuePairs[i] != initialBitValue) {
                        test += finalValuePairs[i]
                    }
                }
            }

            //Divind the data in chunks of 8 to re convert them
            var finalValuePairs = test.match(/.{1,8}/g);
            var originalDecryptedText = "";

            for (var i = 0; i < finalValuePairs.length; i++) {
                originalDecryptedText += String.fromCharCode(parseInt(finalValuePairs[i], 2).toString(10));
            }
            decryptedData = (originalDecryptedText).substring(1);
        }

        //Adding the data to DOM inorder to display
        var para1 = document.createElement("p");
        var node1 = document.createTextNode("DecryptedData for" +caseValue+ ">>>>>>   " + decryptedData);
        para1.appendChild(node1);
        decrptDomDiv.appendChild(para1);
    }

}