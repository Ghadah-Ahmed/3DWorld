(function() {
    // Set our main variables
    let scene,  
      renderer,
      camera,
      model,                              
      loaderAnim = document.getElementById('js-loader');

    
      init(); 
    
    function init() {
    const canvas = document.querySelector('#c');
    const backgroundColor = 0xFFFFFF;
      
      // Init the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);
      
      // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("appebdRender").appendChild(renderer.domElement);

      // Add a camera
        camera = new THREE.PerspectiveCamera(
          20,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
    camera.position.z = 30 
    camera.position.x = 0;
    camera.position.y = -3;
      
      // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);
    
    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);
      
    //   // Floor
    // let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    // let floorMaterial = new THREE.MeshPhongMaterial({
    //   color: 0xeeeeee,
    //   shininess: 0,
    // });
    
    // let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    // floor.receiveShadow = true;
    // floor.position.y = -11;
    // scene.add(floor);
    
    }
      
        
      function update() {
          if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(update);
    }
    update();
      
      function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let canvasPixelWidth = canvas.width / window.devicePixelRatio;
      let canvasPixelHeight = canvas.height / window.devicePixelRatio;
    
      const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
      const MODEL_PATH = 'uploads_files_2805396_my_project(4).glb';
    
    const stacy_mtl = new THREE.MeshPhongMaterial({
      // map: stacy_txt,
      color: 0xffffff,
      skinning: true
    });
    
      var loader = new THREE.GLTFLoader();
    
    loader.load(
      MODEL_PATH,
      function(gltf) {
       // A lot is going to happen here
        model = gltf.scene;
    let fileAnimations = gltf.animations;
    
        
        model.traverse(o => {
     if (o.isMesh) {
      //  o.castShadow = true;
       o.receiveShadow = true;
      //  o.material = stacy_mtl; // Add this line
     }
    });
        // Set the models initial scale
    model.scale.set(7, 7, 7);
        model.rotation.y = 15.7;
        model.rotation.x = 0.5;
    
        model.position.y = -4;
    
    scene.add(model);
    loaderAnim.remove();
    
      },
      undefined, // We don't need this function
      function(error) {
        console.error(error);
      }
    );
      

    document.addEventListener('mousemove', function(e) {
      var mousecoords = getMousePos(e);
    });

    
    function getMousePos(e) {
      return { x: e.clientX, y: e.clientY };
    }
      
      function moveJoint(mouse, joint, degreeLimit) {
      let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
      joint.rotation.y = THREE.Math.degToRad(degrees.x) + 15.1;
      joint.rotation.x = THREE.Math.degToRad(degrees.y) + 0.3;
    }
      
      function getMouseDegrees(x, y, degreeLimit) {
      let dx = 0,
          dy = 0,
          xdiff,
          xPercentage,
          ydiff,
          yPercentage;
    
      let w = { x: window.innerWidth, y: window.innerHeight };
    
      
       // 1. If cursor is in the left half of screen
      if (x <= w.x / 2) {
        // 2. Get the difference between middle of screen and cursor position
        xdiff = w.x / 2 - x;  
        // 3. Find the percentage of that difference (percentage toward edge of screen)
        xPercentage = (xdiff / (w.x / 2)) * 100;
        // 4. Convert that to a percentage of the maximum rotation we allow for the neck
        dx = ((degreeLimit * xPercentage) / 100) * -1; }
    // Right (Rotates neck right between 0 and degreeLimit)
      if (x >= w.x / 2) {
        xdiff = x - w.x / 2;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = (degreeLimit * xPercentage) / 100;
      }
      // Up (Rotates neck up between 0 and -degreeLimit)
      if (y <= w.y / 2) {
        ydiff = w.y / 2 - y;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        // Note that I cut degreeLimit in half when she looks up
        dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
        }
      
      // Down (Rotates neck down between 0 and degreeLimit)
      if (y >= w.y / 2) {
        ydiff = y - w.y / 2;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (degreeLimit * yPercentage) / 100;
      }
      return { x: dx, y: dy };
    }

      document.addEventListener('mousemove', function(e) {
        var mousecoords = getMousePos(e);
      if (model) {
          moveJoint(mousecoords, model, 70);
          // moveJoint(mousecoords, waist, 30);
      }
      });

    })(); 