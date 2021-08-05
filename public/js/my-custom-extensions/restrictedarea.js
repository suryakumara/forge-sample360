class RestrictedArea extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this._button = null;
    this._group = null;
    this.restrictedArea = null;
  }

  load() {
    this.addGeolocation();
    console.log("Restricted Area Loaded !");
    return true;
  }

  unload() {
    console.log("Resctricted Area Unloaded !");
    return true;
  }

  onToolbarCreated() {
    this._group = this.viewer.toolbar.getControl("addRestrictedArea");
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup(
        "restrictedAreaToolbar"
      );
      this.viewer.toolbar.addControl(this._group);
    }
    this._button = new Autodesk.Viewing.UI.Button("restrictedArea");
    this._button.onClick = (ev) => {
      this.viewer.overlays.removeMesh(this.restrictedArea, "custom-scene");
    };
    this._button.setToolTip("Add Restricted Area");
    this._button.addClass("restrictedArea");
    this._group.addControl(this._button);
  }

  addGeolocation() {
    this.viewer.loadExtension("Autodesk.Geolocation").then((e) => {
      console.log(e);
      e.activate();
      console.log(e);
    });
  }

  addRestrictedArea(size) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    this.restrictedArea = new THREE.Mesh(boxGeometry, material);

    this.restrictedArea.scale.set(5 * size, 5 * size, 2 * size);
    this.restrictedArea.position.set(20, 0, 0);
    if (!this.viewer.overlays.hasScene("custom-scene")) {
      this.viewer.overlays.addScene("custom-scene");
    }
    this.viewer.overlays.addMesh(this.restrictedArea, "custom-scene");

    this.viewer.impl.sceneUpdated(true);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "RestrictedArea",
  RestrictedArea
);
