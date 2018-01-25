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
    chrome.tabs.query(
      {
        active : true,
        currentWindow : true
      },
      function(tab) {
        var newTabIndex = tab[0].index + 1;
        chrome.tabs.create(
          {
            index : newTabIndex,
            url : "https://script.google.com/a/google.com/macros/s/AKfycbwQDsAy6mA1e8vwiCuIWj2dJtwSunwjeN7iBADzugYAIbldNLge/exec"
          },
          function(tab) {}
        );
      }
    );
  };
});