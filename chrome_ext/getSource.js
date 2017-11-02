// Get source code from document
function DOMtoString(document_root) {
  node = document_root.querySelector('.iframe-body').getAttribute('srcdoc');
  return node;
};

// Copy string to clipboard
function copyStringToClip(callback) {
  var copyVar = DOMtoString(document);
  // Create dummy element to hold source code
  var dummy = document.createElement("input");
  // Add it to the document
  document.body.appendChild(dummy);
  // Set its ID
  dummy.setAttribute("id", "dummy_id");
  // Output the array into it
  document.getElementById("dummy_id").value = copyVar;
  // Select it
  dummy.select();
  // Copy its contents
  document.execCommand("copy");
  // Remove it as its not needed anymore
  document.body.removeChild(dummy);
  callback();
};

// Open Apps Script UI
function openAppsUI() {
  chrome.runtime.sendMessage({
    method : "openProofTab"
  });
};

copyStringToClip(openAppsUI);