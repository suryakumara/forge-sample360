class addWorker extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);

    this._button_right = null;
    this._button_left = null;
    this._group = null;
    this.sceneBuilder = null;
    this.extLoaded = null;
    this.addWorker = this.addWorker.bind(this);
    this.worker = null;
  }

  load() {
    console.log("loaded add worker extension !");
    this.viewer.addEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.addWorker
    );
    return true;
  }

  unload() {
    console.log("unloaded add worker extension !");
    return true;
  }

  onToolbarCreated() {
    this._group = this.viewer.toolbar.getControl("toolbar-2");
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup("toolbar-2");
      this.viewer.toolbar.addControl(this._group);
    }
    this._button_right = new Autodesk.Viewing.UI.Button("addNewWorker");
    this._button_left = new Autodesk.Viewing.UI.Button("addNewWorker");

    this._button_left.onClick = (ev) => {
      this.worker.position.y += 5;
    };

    this._button_left.setToolTip("moveLeft");
    this._button_left.addClass("moveLeft");
    this._button_right.setToolTip("moveRight");
    this._button_right.addClass("moveRight");
    this._group.addControl(this._button_left, this._button_right);
  }

  addTorus() {
    this.viewer.loadExtension("Autodesk.Viewing.SceneBuilder").then(() => {
      this.sceneBuilder = this.viewer.getExtension(
        "Autodesk.Viewing.SceneBuilder"
      );
      this.sceneBuilder.addNewModel({}).then((modelBuilder) => {
        this.modelBuilder = modelBuilder;
        window.modelBuilder = modelBuilder;

        const purple = new THREE.MeshPhongMaterial({
          color: new THREE.Color(1, 0, 1),
        });
        modelBuilder.addMaterial("purple", purple);

        const torus = new THREE.BufferGeometry().fromGeometry(
          new THREE.TorusGeometry(10, 2, 32, 32)
        );

        const mesh = new THREE.Mesh(torus, purple);
        mesh.matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(0, 12, 50),
          new THREE.Quaternion(0, 0, 0, 1),
          new THREE.Vector3(1, 1, 1)
        );
        mesh.dbId = 100; // Set the database id for the mesh
        modelBuilder.addMesh(mesh);
      });
    });
  }

  addSphere() {
    this.viewer.loadExtension("Autodesk.Viewing.SceneBuilder").then(() => {
      this.sceneBuilder = this.viewer.getExtension(
        "Autodesk.Viewing.SceneBuilder"
      );
      this.sceneBuilder.addNewModel({}).then((modelBuilder) => {
        this.modelBuilder = modelBuilder;
        window.modelBuilder = modelBuilder;

        const geometry = new THREE.BufferGeometry().fromGeometry(
          new THREE.SphereGeometry(5, 8, 8)
        );
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(0, 12, 12),
          new THREE.Quaternion(0, 0, 0, 1),
          new THREE.Vector3(1, 1, 2)
        );

        mesh.dbId = 100; // Set the database id for the mesh
        modelBuilder.addMesh(mesh);
      });
    });
  }

  addWorker() {
    this.viewer.removeEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.addWorker
    );

    const geometry = new THREE.SphereGeometry(1, 32, 57);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const textGeometry = new THREE.TextGeometry("text ID", {
      font: "monaco",
      size: 1,
      height: 0,
      curveSegments: 3,
    });

    textGeometry.computeBoundingBox();
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const workerId = new THREE.Mesh(textGeometry, textMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 3);
    mesh2.position.set(0, 0, 0);
    workerId.position.set(-3, 0, 5);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh2.scale.set(0.5, 0.5, 2);
    // const materials = this.viewer.impl.getMaterials();
    // materials.addMaterial("Unique Material Name", material, true);
    // material info
    workerId.rotation.x = -4.7;
    this.worker = new THREE.Group();
    this.worker.add(workerId);
    this.worker.add(mesh);
    this.worker.add(mesh2);
    if (!this.viewer.overlays.hasScene("custom-scene")) {
      this.viewer.overlays.addScene("custom-scene");
    }
    this.viewer.overlays.addMesh(this.worker, "custom-scene");

    this.viewer.impl.invalidate(true, true, true);
    this.viewer.impl.sceneUpdated(true);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension("addWorker", addWorker);
