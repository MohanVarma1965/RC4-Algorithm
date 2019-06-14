// On submit this is method is invoked
function formSubmit(event) {
    //prevent the default behaviour
    event.preventDefault()

    //Getting the DOM elements
    var key = document.getElementById('secretKey').value;
    var message = document.getElementById('inputText').value;


    //This DOM element is used to append encrypted text
    var encryptedDomDiv = document.getElementById("encrypting");
    //This resets the text every time submit is pressed
    encryptedDomDiv.innerHTML = "";
   

    //Dividing into packets and adding sequence counter and padding data for the empty values
    var dataPacket = convertiontoPackets(message);
    
    //This encrypts the data with the data and their hash values
    var encryptedDataObject = sender(dataPacket, key, encryptedDomDiv);
    
    //This receiver method decrypts the data and displays them on the DOM
    // Receiver only gets the key and the encrypted message and displays the end result
    receiver(encryptedDataObject, key);
    
}

// This function implements the RC4 algorithm
function rc4(key, message) {
    var s = [];
    var j = 0;
    var temp = '';
    var encryptedString = '';
    var m = '';

    // setting the initial state of S "State vector"
    for (var i = 0; i < 256; i++) {
        s[i] = i;
    }

    //KSA algorithm to generate random numbers in  S depending on the key length
    for (var i = 0; i < 256; i++) {

        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        // swapping the s[i] and s[j] values
        temp = s[j];
        s[j] = s[i];
        s[i] = temp;
    }

    // PRGA algorithm
    //Initialize the values again to get the PRGA loop running
    i = 0;
    j = 0;

    for (var k = 0; k < message.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;

        // swapping the values    
        temp = s[i];
        s[i] = s[j];
        s[j] = temp;

        m = s[(s[i] + s[j]) % 256];
        encryptedString += String.fromCharCode(message.charCodeAt(k) ^ m);
    }

    return encryptedString
}

// This method resets the DOM elements when reset is pressed
function reset(event) {
     event.preventDefault();
     document.getElementById("testing").checked =false;
     document.getElementById("case2").checked =false;
     document.getElementById("case3").checked =false;
}