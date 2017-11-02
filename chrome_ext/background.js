// Copy email content from Gamma live proof when extension icon is clicked
chrome.browserAction.onClicked.addListener(
  function() {
    chrome.tabs.executeScript(null, {file: "getSource.js"});
  }
);

// Open new tab when getSource is run
// and run pasteSource in new tab
chrome.runtime.onMessage.addListener(function(request) {
  if (request.method == "openProofTab") {
    chrome.tabs.create({
      index : 1,
      url : "https://script.google.com/a/google.com/macros/s/AKfycbwQDsAy6mA1e8vwiCuIWj2dJtwSunwjeN7iBADzugYAIbldNLge/exec"
    },
    function(tab) {
      chrome.tabs.executeScript(tab.id, {
        file : "pasteSource.js",
        runAt : "document_end"
      });
    });
  };
});