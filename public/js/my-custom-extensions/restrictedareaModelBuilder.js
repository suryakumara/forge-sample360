class RestrictedAreaMB extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.sceneBuilder = null;
    this.modelBuilder = null;

    this.customize = this.customize.bind(this);
  }

  load() {
    console.log("SimpleCustomGeometry is loaded!");
    this.viewer.addEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.customize
    );

    return true;
  }

  unload() {
    console.log("SimpleCustomGeometry is now unloaded!");

    return true;
  }

  customize() {
    this.viewer.removeEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.customize
    );

    this.viewer.loadExtension("Autodesk.Viewing.SceneBuilder").then(() => {
      this.sceneBuilder = this.viewer.getExtension(
        "Autodesk.Viewing.SceneBuilder"
      );

      this.sceneBuilder.addNewModel({}).then((modelBuilder) => {
        this.modelBuilder = modelBuilder;
        window.modelBuilder = modelBuilder;

        const sphereGeometry = new THREE.BufferGeometry().fromGeometry(
          new THREE.SphereGeometry(5, 8, 8)
        );
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(0, 1, 0),
        });

        this._mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        this._mesh.matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(0, 0, 100),
          new THREE.Quaternion(0, 0, 0, 1),
          new THREE.Vector3(1, 1, 1)
        );

        this.modelBuilder.addMesh(this._mesh);
      });
    });
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "RestrictedAreaMB",
  RestrictedAreaMB
);
