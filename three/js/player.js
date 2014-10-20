var Player = function() {


    this.controller = null;
    this.model = null;
    this.camera = null;
    this.scene = null;
    this.attacks = null;

    // cameraDiff is the vector-difference of the model to the camera
    this.cameraDiff = null;

    // config for the player variables set by the user
    this.playerDetails = null;

    // vector describing the current movement
    this.currentMovement = null,

    this.isJumping = null;

    this.isFalling = null;


    /**
     * loads the player into the given scene
     */
    this.loadPlayer = function(scene, playerDetails) {
        console.log("loading player", this);
        var _self = this;

        this.scene = scene;

        this.playerDetails = playerDetails;

        this.isJumping = false;
        this.isFalling = false;

        this.currentMovement = new THREE.Vector3(0, 0, 0);

        this._loadModel(playerDetails.model);

        this._loadCamera();


        this.controller = new GameController(playerDetails.controller);
        this.controller.loadConnections();



        //setting up the attacks
        this.attacks = [];
        playerDetails.attacks.forEach(function(attack) {
            var atk = new Attack();
            atk.load.apply(atk, attack.params);
            _self.attacks[attack.index] = atk;

        });


        // setting basic camera difference which will stay constant
        this.cameraDiff = new THREE.Vector3(0, 0, 0).subVectors(
            this.camera.position,
            this.model.position
        );

    };

    /**
     * Loads the player model
     */
    this._loadModel = function(modelDetails) {
        console.log("Loading player model");

        var _self = this;

        var material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("media/textures/lava.png"),
            side: THREE.DoubleSide
        });
        var playerGeometry = new THREE.SphereGeometry(
            modelDetails.size.selected,
            32,
            32);
        this.model = new THREE.Mesh(playerGeometry, material);

        //setup all additionally needed attributes            
        this.model.position.y += this.model.geometry.parameters.radius;
        this.model.relativeZeroHeight = this.model.geometry.parameters.radius / 2;
        this.model.mass = modelDetails.mass.selected;
        this.model.castShadow = true;
        this.model.hasGravity = true;
        this.model.isGameobject = true;
        this.model.isPlayer = true;
        this.model.playerReference = this;
        this.scene.add(this.model);
    };


    /**
     * loads the player camera
     */
    this._loadCamera = function() {

        this.camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            750
        );
        this.camera.position.z = -1 * this.playerDetails.camera.distance_x.selected;
        this.camera.position.y = this.playerDetails.camera.distance_y.selected;
    };


    /**
     * updates the model and camera location based on input submitted by the controller
     */
    this.updatePlayer = function() {

        var input = this.controller.getUserInputRelativeToPlayer();

        this._moveModel(input.movement);
        this._adjustCamera();

        this._rotateModel(input.rotation);
        this._rotateCamera(input.rotation);

        this._executePlayerAction(input.playeractions);
    };

    /**
     * is used by the physics-engine to move down the player
     */
    this.applyGravityToPlayer = function(gravityStrength) {
        var _self = this;

        var gravVector = new THREE.Vector3(0, -1, 0).
        normalize().
        multiplyScalar(gravityStrength);

        if (this.isFalling) {
            gravVector.multiplyScalar(1.5);
        }



        // preparing vectors for the RC
        var playerSize = this.playerDetails.model.size.selected;
        var rayDirectionVector = gravVector.clone().normalize();

        // creating the RC
        var raycaster = new THREE.Raycaster(
            this.model.position.clone(),
            rayDirectionVector,
            0,
            playerSize + Math.abs(gravVector.y)
        );


        //TODO: find way to dynamically load rays
        var raycastOrigins = [this.model.position];

        for (var i = 0; i <= 4; i++) {
            raycastOrigins.push(this.model.position.clone());
        }
        raycastOrigins[1].x += playerSize;
        raycastOrigins[2].x -= playerSize;
        raycastOrigins[3].z += playerSize;
        raycastOrigins[4].z -= playerSize;

        //the container for all intersected objects. should only contain a single element once
        var objectsIntersected = [];


        //fetching collisions

        //seperate raycast for each raycastOrigin
        raycastOrigins.forEach(function(origin, index) {

            raycaster.set(origin, rayDirectionVector);

            //all intersected objects
            raycaster.intersectObjects(scene.children).forEach(function(element, index) {

                if (element.object.isGameobject && !element.object.isPlayer && !element.object.isDead) {
                    //make sure we only have the same element in the array ONCE
                    //TODO: write a better scan-array-for-object
                    var objectAlreadyThere = false;
                    objectsIntersected.forEach(function(intersectedElement, index) {
                        if (element.object.id === intersectedElement.object.id) {
                            objectAlreadyThere = true;
                        }
                    });
                    if (!objectAlreadyThere) {
                        objectsIntersected.push(element);
                    }
                }

            });
        });


        // if falling would lead to a collision
        if (objectsIntersected.length > 0) {

            //this is used 
            var isStillMoveable = false;
            var minimalMovementDistance = 0;
            objectsIntersected.forEach(function(element) {
                if (element.distance > _self.playerDetails.model.size.selected) {
                    isStillMoveable = true;
                    minimalMovementDistance = element.distance - _self.playerDetails.model.size.selected;
                }
            });

            if (isStillMoveable) {
                _self.model.position.y -= minimalMovementDistance;
            }

            this.isFalling = false;
            this.isJumping = false;

            // otherwise perform the free fall
        } else {

            Utility.objForEach(gravVector, function(axis, value) {
                _self.model.position[axis] += value;
            });
            this.isFalling = true;

        }
    };


    /**
     * Moves a model based on the given vector
     */
    this._moveModel = function(inputVector) {


        //modify the vector appropriately
        var newMovementVector = inputVector.applyMatrix3(
            Utility.getYRotationMatrix(this.model.rotation.y)).
        normalize().
        multiplyScalar(this.playerDetails.movement.speed.selected);


        // factor in the current movement
        newMovementVector.multiplyScalar(this.playerDetails.movement.acceleration.selected);
        this.currentMovement.multiplyScalar(1 - this.playerDetails.movement.acceleration.selected);
        newMovementVector.add(this.currentMovement);

        // // RAYCASTING TO CHECK FOR OBJECTS ALONG THE LINE OF MOVEMENT             
        var rayDirectionVector = newMovementVector.clone().normalize();

        var playerSize = this.playerDetails.model.size.selected;

        //actual raycaster
        var raycaster = new THREE.Raycaster(
            this.model.position,
            rayDirectionVector,
            0,
            this.playerDetails.model.size.selected
        );

        // var objectsIntersected = [];
        // raycaster.intersectObjects(scene.children).forEach(function(element, index) {
        //     if (element.object.isGameobject && !element.object.isPlayer && !element.object.isDead) {

        //         objectsIntersected.push(element);
        //     }
        // });


        //TODO: find way to dynamically load rays
        var raycastOrigins = [this.model.position];

        for (var i = 0; i <= 4; i++) {
            raycastOrigins.push(this.model.position.clone());
        }

        //TODO: recalculate that. those are not the coordinates we want (not rotated)
        raycastOrigins[1].x += playerSize;
        raycastOrigins[2].x -= playerSize;
        raycastOrigins[3].y += playerSize;
        raycastOrigins[4].y -= playerSize;

        //the container for all intersected objects. should only contain a single element once
        var objectsIntersected = [];


        //fetching collisions

        //seperate raycast for each raycastOrigin
        raycastOrigins.forEach(function(origin, index) {

            raycaster.set(origin, rayDirectionVector);

            //all intersected objects
            raycaster.intersectObjects(scene.children).forEach(function(element, index) {

                if (element.object.isGameobject && !element.object.isPlayer && !element.object.isDead) {
                    //make sure we only have the same element in the array ONCE

                    //TODO: write a better scan-array-for-object
                    var objectAlreadyThere = false;
                    objectsIntersected.forEach(function(intersectedElement, index) {
                        if (element.object.id === intersectedElement.object.id) {
                            objectAlreadyThere = true;
                        }
                    });
                    if (!objectAlreadyThere) {
                        objectsIntersected.push(element);
                    }

                }

            });
        });


        if (objectsIntersected.length > 0) {
            console.log("INTERSECTED:", objectsIntersected);
            newMovementVector = new THREE.Vector3(0, 0, 0);
            //newMovementVector.negate().multiplyScalar(0.3);
        }

        //perform the movement
        var _self = this;
        Utility.objForEach(newMovementVector, function(axis, value) {
            _self.model.position[axis] += value;
        });

        this.currentMovement = newMovementVector;

    };

    /**
     * rotates a model based on the given rotation
     */
    this._rotateModel = function(rotation) {

        if (rotation.horizontal != 0) {
            var alpha = rotation.horizontal;
            this.model.rotation.y += alpha;
        }
    };

    /**
     * Adjusts the camera to automatically stick to the player based on cameraDiff
     */
    this._adjustCamera = function() {

        this.camera.position.addVectors(this.model.position, this.cameraDiff);

        this.camera.lookAt(this.model.position);
    };



    /**
     * Rotates the camera based on the given input
     * I'm trying to get this functionality into adjustCamera at some point
     */
    this._rotateCamera = function(rotation) {

        if (rotation.vertical != 0 || rotation.horizontal != 0) {

            var cameraPositionRelativeToZero = new THREE.Vector3().subVectors(
                this.camera.position,
                this.model.position
            );


            var alpha = rotation.horizontal;

            var rotationMatrix = Utility.getYRotationMatrix(alpha);


            var cameraPositionChange = cameraPositionRelativeToZero.applyMatrix3(rotationMatrix);

            this.camera.position.addVectors(cameraPositionChange, this.model.position);

            // change camera diff so it stays consistent
            this.cameraDiff = new THREE.Vector3(0, 0, 0).subVectors(
                this.camera.position,
                this.model.position);


            this.camera.lookAt(this.model.position);

        }
    };

    /**
     * Executes the given playeraction
     */
    this._executePlayerAction = function(actions) {

        var _self = this;



        actions.forEach(function(action) {
            if (action === "jump") {
                if (!_self.isJumping) {
                    _self.isJumping = true;
                    _self.currentMovement.add(new THREE.Vector3(
                        0,
                        _self.playerDetails.movement.jumping_power.selected,
                        0));
                }
                return;
            }



            var id = parseInt(action.slice(-1));
            _self.attacks[id - 1].executeAttack(_self.model, _self.scene);
        });
    };

}