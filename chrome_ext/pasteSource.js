// ************ This script is meant to paste email
// content into a hidden input in the apps script UI.
// However this doesn't work due to the inability
// to select the input in the UI due to multiple
// nested iframes and Same Origin Policy violations.

// Select hidden input field
// if (document.getElementById("sandboxFrame")) {
//   document.getElementById("sandboxFrame")
// } else {
//   console.log("missing");
// };

// Paste clipboard data into hidden input
// document.execCommand("paste");

// // Create dummy input
// var dummy = document.createElement("input");
// // Add it to the document
// document.body.appendChild(dummy);
// // Set its ID
// dummy.setAttribute("id", "dummy_id");
// // Select it
// dummy.select();
// // Paste into dummy
// document.execCommand("paste");
// // Store dummy value to variable
// var pastedContent = dummy.value;
// // Remove it as its not needed anymore
// document.body.removeChild(dummy);


// var channel = new MessageChannel();

// var ifr = document.querySelector('#userHtmlFrame');
// var otherWindow = ifr.contentWindow;
// ifr.addEventListener("load", iframeLoaded, false);

// function iframeLoaded() {
//   otherWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
// }
// channel.port1.onmessage = handleMessage;
// function handleMessage(e) {
//   para.innerHTML = e.data;
// }