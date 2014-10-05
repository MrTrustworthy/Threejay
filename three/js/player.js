
    var Player = function(){


        this.controller = null;
        this.model = null;
        this.camera = null;
        this.scene = null;

        /**
         * cameraDiff is the vector-difference of the model to the camera
         * it gets changed if the cam rotates
         */
        this.cameraDiff = null;

        /**
         * loads the player into the given scene
         */
        this.loadPlayer = function(scene){

            

            this.scene = scene;

            console.log("loading player", this);

            this._loadModel();
            scene.add(this.model);


            this._loadCamera();

            this.cameraDiff = new THREE.Vector3(0, 0, 0).subVectors(
                this.camera.position, 
                this.model.position);


            this.controller = new GameController();
            this.controller.loadConnections();

            
        };

        this._loadModel = function(){
            var _self = this;
            console.log("Loading player model");

            
            var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("media/textures/white.jpg"),
                    side: THREE.DoubleSide
                })
            var boxGeometry = new THREE.BoxGeometry(10,15,20);
            this.model = new Physijs.BoxMesh(boxGeometry, material, 2000);
            this.model.position.y += (this.model.geometry.parameters.height / 2)+ 10;
            this.model.castShadow = true;


            this.model.addEventListener("collision", function(a,b,c,d){
                console.log("Collision!!!!");



            });

            this.model.addEventListener("change", function(a){
                console.log("changed!!!");
            });



        };

        this._loadCamera = function(){

            this.camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                500
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

            //this._rotateCamera(input.rotation);
        };


        this._moveModel = function(vector){
            var _self = this;
            if(vector.x != 0 || vector.y != 0 || vector.z != 0 ){

                Utility.objForEach(vector, function(axis, value) {
                    _self.model.position[axis] += value;                   
                });
                this.model.__dirtyPosition = true;

                // var rotation_matrix = new THREE.Matrix4().extractRotation(this.model.matrix);
                // var force_vector = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation_matrix);
                // this.model.applyCentralImpulse(force_vector);
            }
        };

        this._rotateModel = function(rotation){
            
            if(rotation.horizontal != 0){               
                var alpha = rotation.horizontal;
                this.model.rotateY(alpha);
                console.log("rotation:", this.model.rotation.y);
                //this.model.rotation.y += alpha;
                this.model.__dirtyRotation = true;
               
            }
        };

        /**
         * Adjusts the camera to automatically stick to the player based on cameraDiff
         */
        this._adjustCamera = function(){

            this.camera.position.addVectors(this.model.position, this.cameraDiff);

            this.camera.lookAt(this.model.position);


            // var cameraPositionRelativeToZero = new THREE.Vector3().subVectors(
            //     this.camera.position, 
            //     this.model.position
            //     );


            // var alpha = this.model.rotation.y;

            // var rotationMatrix = Utility.getYRotationMatrix(alpha);


            // var cameraPositionChange = cameraPositionRelativeToZero.applyMatrix3(rotationMatrix);

            // this.camera.position.addVectors(cameraPositionChange, this.model.position);

            // // change camera diff so it stays consistent
            // this.cameraDiff = new THREE.Vector3(0, 0, 0).subVectors(
            // this.camera.position, 
            // this.model.position);


            // this.camera.lookAt(this.model.position);







        };


        /**
         * Rotates the camera based on the given input
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


