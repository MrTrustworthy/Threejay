define(["controller", "util"], function(Controller, Utility) {


    var player = function(){


        this.controller = null;
        this.model = null;
        this.camera = null;

        /**
         * loads the player into the given scene
         */
        this.loadPlayer = function(scene){

            console.log("Loading player stats");

            this.controller = new Controller();
            this.controller.loadConnections();

            this.model = new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.MeshNormalMaterial({
                    color: 0x00ff00,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                })
            );

            this.model.position.y = 20; //+= this.model.geometry.parameters.height / 2;

            scene.add(this.model);

            this.camera = new THREE.PerspectiveCamera(
                75, window.innerWidth / window.innerHeight, 0.1, 10000
                );
            this.camera.position.z = -50;
            this.camera.position.y = 20;

            console.log("player loaded", this);

        };


        /**
         * updates the model and camera location based on input submitted by the controller
         */
        this.updatePlayer = function() {
            var _self = this;
            var input = this.controller.getFormattedDisplacementInformation();
            var movement = input.movement;
            var rotation = input.rotation;

            if(movement.x != 0 ||movement.y != 0 || movement.z != 0 ){                
                Utility.objForEach(movement, function(axis, value) {
                    _self.model.position[axis] += value;
                    _self.camera.position[axis] += value;
                });
            }

            this._applyRotation(rotation);


            this.camera.lookAt(_self.model.position);

        };


        this._applyRotation = function(rotation){

            if(rotation.vertical != 0 || rotation.horizontal != 0){
                
                console.log("rotating! model:", this.model.position, 
                    "camera position:", this.camera.position);

                var modelPosition = new THREE.Vector3(
                    this.model.position.x, 
                    this.model.position.y, 
                    this.model.position.z
                    );

                var cameraPosition = new THREE.Vector3(
                    this.camera.position.x, 
                    this.camera.position.y, 
                    this.camera.position.z
                    );

                var p = 0.1;
                var distance = modelPosition.distanceTo(cameraPosition); // = 50

                var alpha = (180*p)/(Math.PI*distance);
                console.log("Alpha:", alpha);

                //transponieren
                var turnZ = new THREE.Matrix3(
                    Math.cos(alpha), -Math.sin(alpha), 0, 
                    Math.sin(alpha), Math.cos(alpha), 0, 
                    0, 0, 1);

                var newposition = cameraPosition.applyMatrix3(turnZ);
                this.camera.position.x = newposition.x;
                this.camera.position.y = newposition.y;
                this.camera.position.z = newposition.z;

                console.log("done rotating!", this.newposition);
            }


        };

    }
    return player;

});