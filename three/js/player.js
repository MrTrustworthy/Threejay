
    var Player = function(){


        this.controller = null;
        this.model = null;
        this.camera = null;
        this.scene = null;
        this.attacks = null;

        /**
         * cameraDiff is the vector-difference of the model to the camera
         * it gets changed if the cam rotates
         */
        this.cameraDiff = null;

        /**
         * loads the player into the given scene
         */
        this.loadPlayer = function(scene){
            console.log("loading player", this);
            
            this.scene = scene;

            this._loadModel();

            this._loadCamera();


            this.controller = new GameController();
            this.controller.loadConnections();


            this.cameraDiff = new THREE.Vector3(0, 0, 0).subVectors(
                this.camera.position, 
                this.model.position
                );

            this.attacks = {};

            var attack_1 = new Attack();
            attack_1.loadPrebuiltAttack("Sniper");
            this.attacks.attack_1 = attack_1;

            var attack_2 = new Attack();
            attack_2.loadPrebuiltAttack("Strike");
            this.attacks.attack_2 = attack_2;

            var attack_3 = new Attack();
            attack_3.loadPrebuiltAttack("Fireball");
            this.attacks.attack_3 = attack_3;

            var attack_4 = new Attack();
            attack_4.loadPrebuiltAttack("Kick");
            this.attacks.attack_4 = attack_4;

            
        };

        /**
         * Loads the player model
         */
        this._loadModel = function(){
            var _self = this;
            console.log("Loading player model");

            
            var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("media/textures/white.jpg"),
                    side: THREE.DoubleSide
                })
            var boxGeometry = new THREE.BoxGeometry(10,15,20);
            this.model = new THREE.Mesh(boxGeometry, material);
            this.model.position.y += this.model.geometry.parameters.height / 2;
            this.model.castShadow = true;

            this.model.hasGravity = true;
            this.model.relativeZeroHeight = this.model.geometry.parameters.height / 2;
            this.model.mass = 5;
            this.model.isGameobject = true;
            this.model.isPlayer = true;

            this.scene.add(this.model);
        };


        /**
         * loads the player camera
         */
        this._loadCamera = function(){

            this.camera = new THREE.PerspectiveCamera(
                90, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                750
            );
            this.camera.position.z = -50;
            this.camera.position.y = 40;
        };


        /**
         * updates the model and camera location based on input submitted by the controller
         */
        this.updatePlayer = function() {

            var input = this.controller.getUserInputRelativeToPlayer();


            //format movement input to work according to the current rotation.
            var currentRotation = this.model.rotation.y;

            // translate the given movement coordinates to the coordinates calculated based
            // on the current player rotation
            input.movement = input.movement.applyMatrix3(Utility.getYRotationMatrix(currentRotation));


            //movement
            this._moveModel(input.movement);

            this._rotateModel(input.rotation);



            this._adjustCamera();            

            this._rotateCamera(input.rotation);

            this._executePlayerAction(input.playeractions);
        };


        /**
         * Executes the given playeraction
         */
        this._executePlayerAction = function(actions){

            var _self = this;
            actions.forEach(function(action){
                _self.attacks[action].executeAttack(_self.model, _self.scene);
            });
        };



        /**
         * Moves a model based on the given vector
         */
        this._moveModel = function(vector){
            var _self = this;
            if(vector.x != 0 || vector.y != 0 || vector.z != 0 ){

                Utility.objForEach(vector, function(axis, value) {
                    _self.model.position[axis] += value;                   
                });
                this.model.__dirtyPosition = true;
            }
        };

        /**
         * rotates a model based on the given rotation
         */
        this._rotateModel = function(rotation){
            
            if(rotation.horizontal != 0){               
                var alpha = rotation.horizontal;
                this.model.rotation.y += alpha;               
            }
        };

        /**
         * Adjusts the camera to automatically stick to the player based on cameraDiff
         */
        this._adjustCamera = function(){

            this.camera.position.addVectors(this.model.position, this.cameraDiff);

            this.camera.lookAt(this.model.position);
        };



        /**
         * Rotates the camera based on the given input
         * I'm trying to get this functionality into adjustCamera at some point
         */
        this._rotateCamera = function(rotation){

            if(rotation.vertical != 0 || rotation.horizontal != 0){

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

    }


