var viewer;
let textExt = null;

// @urn the model to show
// @viewablesId which viewables to show, applies to BIM 360 Plans folder
function launchViewer(urn, viewableId) {
  var options = {
    env: "AutodeskProduction",
    getAccessToken: getForgeToken,
    api:
      "derivativeV2" +
      (atob(urn.replace("_", "/")).indexOf("emea") > -1 ? "_EU" : ""), // handle BIM 360 US and EU regions
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(
      document.getElementById("forgeViewer"),
      {
        extensions: [
          "Autodesk.DocumentBrowser",
          "addWorker",
          "RestrictedArea",
          "GoogleMapsExtension",
          "RestrictedAreaMB",
        ],
      }
    );
    viewer.start();
    var documentId = "urn:" + urn;
    Autodesk.Viewing.Document.load(
      documentId,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });

  function onDocumentLoadSuccess(doc) {
    // if a viewableId was specified, load that view, otherwise the default view
    var viewables = viewableId
      ? doc.getRoot().findByGuid(viewableId)
      : doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(
      // any additional action here?
      onLoadFinished
    );
  }

  function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
    console.error(
      "onDocumentLoadFailure() - errorCode:" +
        viewerErrorCode +
        "\n- errorMessage:" +
        viewerErrorMsg
    );
  }
}

function getForgeToken(callback) {
  fetch("/api/forge/oauth/token").then((res) => {
    res.json().then((data) => {
      callback(data.access_token, data.expires_in);
    });
  });
}

function updateUI() {
  textExt.addRestrictedArea(document.getElementById("fontSize").value);
}

// custom function
function onLoadFinished() {
  textExt = viewer.getExtension("RestrictedArea");
  updateUI();
}
