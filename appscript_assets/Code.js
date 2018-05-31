// Create session token ID
var minimum = 10000000;
var maximum = 99999999;
sessionId = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
// Logger.log(sessionId);

function doGet(e) {
  // Create template for web app
  var output = HtmlService.createHtmlOutputFromFile('sendUi');
  output.setFaviconUrl('https://services.google.com/fh/files/emails/proofing_tool_favicon_128x128.png');
  output.setTitle("Epsilon QA Proofing Tool");
  return output;
};

function commaStringToList(commaString) {
  var splitList = commaString.split(",");
  return splitList;
};

// Send an email using the parameters
// name, recipient, subject, html
// template, and cc list
function sendEmail(emName, emRecipient, emSubject, emHtmlBody) {
  try {
    MailApp.sendEmail({
      name: emName,
      to: emRecipient,
      subject: emSubject,
      htmlBody: emHtmlBody
    });
  } catch(err) {
    Logger.log("could not send email");
  };
};

function send_proof(emailTemplate, sendToLdap, sendToDevs, sendToQA, emails, gammaId, subjectLine, fromName) {
  // Create recipient list
  var recipients = [];
  if (sendToLdap) {
    var userEmail = Session.getActiveUser().getEmail();
    recipients.push(userEmail);
  };
  // Add dev alias
  if (sendToDevs) {
    recipients.push("solsethtctest@gmail.com");
  };
  // Add QA alias
  if (sendToQA) {
    recipients.push("epsilonqatest@gmail.com");
  };
  // Add individual emails
  if (emails.trim()) {
    var emailList = commaStringToList(emails);
    recipients = recipients.concat(emailList);
  };
  // Convert to comma delimited string
  var recipientList = recipients.toString();
  // Create template from string
  var htmlBody = HtmlService.createTemplate(emailTemplate).getRawContent();
  // Create subject line
  var subject = subjectLine.trim();
  if (!subject) {
    // Check for gamma ID and add to subject line
    if (gammaId.trim()) {
      var subject = "QA Proof | Gamma ID - " + gammaId + " | Proof ID - " + sessionId;
    } else {
      var subject = "QA Proof | Proof ID - " + sessionId;
    };
  };
  // Create from name
  var from = fromName.trim();
  if (!from) {
    var from = "QA Proofing Tool";
  };
  Logger.log(htmlBody);
  // Send email
  sendEmail(from, recipientList, subject, htmlBody);
};

function send_report(data, addRecipients, gammaId) {
  var htmlBody = HtmlService.createTemplateFromFile("reportTemplate");
  htmlBody.data = data;
  var htmlTemplate = htmlBody.evaluate().asTemplate().getRawContent();
  // Create recipient list
  var recipients = [];
  var userEmail = Session.getActiveUser().getEmail();
  recipients.push(userEmail);
  if (addRecipients) {
    var addRecipientsList = commaStringToList(addRecipients);
    recipients.push(addRecipientsList);
  };
  // Convert to comma delimited string
  var recipientList = recipients.toString();
  // Add Gamma ID to subjectline
  if (gammaId.trim()) {
    var subject = "QA Report | Gamma ID - " + gammaId + " | Proof ID - " + sessionId;
  } else {
    var subject = "QA Report | Proof ID - " + sessionId;
  };
  // Send email
  sendEmail("QA Proofing Tool", recipientList, subject, htmlTemplate);
};

// Reformats Gamma Proofing Page HTML to comply with XML parser
function xmlCleaner(xmlString) {
  var fixedHtml = xmlString.replace('EN">','EN" "">').replace("</HEAD>","</head>").replace(/<br>/g,"<br />").replace("</HTML>","</html>");
  Logger.log("xmlCleaner: " + fixedHtml);
  return fixedHtml;
}

function getTrackedData(url) {
  if (url.indexOf("https://www.google.com/appserve/mkt/proof/optout") == 0 ||
      url.indexOf("https://gamma-redirector-staging.appspot.com/proof/optout") == 0 ) {
  // In case of optout link
    var trackedData = {
      "url" : url,
      "label" : "optout"
    };
  } else if (url.indexOf("https://www.google.com/appserve/mkt/proof") == 0 ||
             url.indexOf("http://www.google.com/appserve/mkt/proof") == 0 ||
             url.indexOf("https://gamma-redirector-staging.appspot.com/proof") == 0 ||
             url.indexOf("http://gamma-redirector-staging.appspot.com/proof") == 0) {
  // In case of normal tracked link
    // Fetch content from URL
    var htmlString = UrlFetchApp.fetch(url).getContentText();
    // Convert HTML to XML string
    try {
      var parsedXML = xmlCleaner(htmlString);
    } catch(err) {
      Logger.log("Could not clean HTML");
    };
    // Parse content to XML
    var doc = XmlService.parse(parsedXML);
    // Get elements from XML
    var rootElement = doc.getRootElement();
    var descendants = rootElement.getDescendants();
    // Index of destination URL and tracking label elements on proofing page
    var destIndex = 15;
    var labelIndex = 23;
    var trackedData = {
      "url" : descendants[destIndex],
      "label" : descendants[labelIndex]
    };
  } else if (url.indexOf("mailto:") == 0) {
  // In case of mail to link
    var trackedData = {
      "url" : url,
      "label" : "Mailto link, not tracked"
    };
  } else if (url == "#") {
  // In case of dummy # link
    var trackedData = {
      "url" : url,
      "label" : "Dummy link, not tracked"
    };
  } else {
  // In case of any other non-tracked links
    var trackedData = {
      "url" : url,
      "label" : "Link not tracked"
    };
  }
  return trackedData;
}