var GameWorld = function() {


    //placeholder to load textured all at once
    this.textureBuffer = {
        SoftWood: THREE.ImageUtils.loadTexture("media/textures/SoftWood.jpg"),
        Box: THREE.ImageUtils.loadTexture("media/textures/Box.jpg"),
        Stone: THREE.ImageUtils.loadTexture("media/textures/Stone.jpg"),
        Metal: THREE.ImageUtils.loadTexture("media/textures/Metal.jpg")
    };


    //loads the world
    this.loadWorld = function(scene, worldDetails) {

        for (var i = 0; i < worldDetails.amountOfObjects.selected; i++) {
            this.createBasicGameobject(scene, worldDetails);
        }


        // create the floor
        var geometry = new THREE.BoxGeometry(1000, 0.1, 1000);
        var material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("media/textures/floor3.jpg"),
        });

        var plane = new THREE.Mesh(
            geometry,
            material
        );
        plane.receiveShadow = true;
        plane.isGameobject = true;
        scene.add(plane);


        var light = new THREE.AmbientLight(0x000000);
        scene.add(light);


        var fog = new THREE.Fog(0x000000, 120, 350);
        scene.fog = fog;

    };


    this.createBasicGameobject = function(scene, worldDetails) {

        var objSize = worldDetails.sizeOfObjects;



        var geometry = new THREE.BoxGeometry(
            Utility.randomInt(objSize.max - objSize.min) + objSize.min,
            Utility.randomInt(objSize.max - objSize.min) + objSize.min,
            Utility.randomInt(objSize.max - objSize.min) + objSize.min
        );


        var substance = Utility.getRandomSubstance();

        var material = new THREE.MeshBasicMaterial({
            map: this.textureBuffer[substance.name],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1.0
        });

        var gameobject = new THREE.Mesh(
            geometry,
            material

        );
        gameobject.position.x = Utility.randomInt(worldDetails.spreadOverArea.selected, true);
        gameobject.position.z = Utility.randomInt(worldDetails.spreadOverArea.selected, true);
        gameobject.position.y += (gameobject.geometry.parameters.height / 2) + 50 + Utility.randomInt(150, false);


        //this is for the physics and stuff. 
        gameobject.hasGravity = true;
        gameobject.relativeZeroHeight = gameobject.geometry.parameters.height / 2;
        gameobject.mass =
            (gameobject.geometry.parameters.width *
            gameobject.geometry.parameters.height *
            gameobject.geometry.parameters.depth *
            substance.strength) / 10000;

        gameobject.isGameobject = true;
        gameobject.isHittable = true;
        gameobject.health = (gameobject.geometry.parameters.width +
            gameobject.geometry.parameters.height +
            gameobject.geometry.parameters.depth) * substance.strength;



        scene.add(gameobject);



    };



}