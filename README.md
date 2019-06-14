# RC4-Algorithm

I have used JavaScript as the programming language.

Steps to run the program:
1.	Download the project 
2.	Find the .html file with name main 
3.	Double click the main.html to open in it in the browser and user can enter the values to test the program.


UI in the browser will be displayed as 
![alt text](https://github.com/MohanVarma1965/RC4-Algorithm/blob/master/1Full%20Page.png)

Concept:
1.	I have divided the data into 252 bytes each and padded 1 followed by 0’s to the last dataset if the length is not 252 bytes.
2.	Next MD5 algorithm is used to get hash values of 128 bit to each 252 bytes data and appended the hash values at the end of each data set. Used the below reference to get MD5 algorithm 
https://css-tricks.com/snippets/javascript/javascript-md5/
3.	Then using KSA and PRGA the data sets with their respective hash values are encrypted.
4.	In the receiver side the encrypted data is sent and they key as it is shared between the receiver and sender. 
5.	On the receiver side the same RC4 algorithm is used to decrypt the data and removed the hash values and the empty spaces in the last dataset and the result is displayed on DOM.

How to run encryption and decryption:
1.	First I have attached the reference text.
2.	Please copy paste the secret key and reference text.
3.	It’s not mandatory to use the reference texts, the code is dynamic enough to decrypt and encrypt data for any data. 
4.	Without clicking on any of the testing radio buttons click encrypt and decrypt button.
5.	Scroll down to see the text encrypted and decrypted on the receiver side. 

Testing the cases:
1.	For testing the code please select the testing button.
2.	Then select any one of the case and click on encrypt and decrypt button.
3.	Case1  this is the default case and can be displayed without selecting any of the testing radio buttons
4.	Case2 select the testing button and case2 to display the scenario 2 (1, 0, 3 and 2)
5.	Case3 select the testing button and case3 to display the scenario 3 (3, 2, 1 and 0)
6.	Decrypted text will be shown below on the page.
To get better results for testing please select the reference text which divides the input into 4 parts.
