

	var PlayerCamera = function(){


		this.camera = null;
		this.cameraLocked = true;
		this.playerModel = null;

		this.loadCamera = function(playermodel){

			this.camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                500
            );
            this.camera.position.z = -50;
            this.camera.position.y = 40;

            this.playerModel = playermodel;

		};


		/**
		 * Moves the camera based on the given vector
		 */
		this.moveCamera = function(vector){

			var _self = this;
			if(vector.x != 0 || vector.y != 0 || vector.z != 0 ){                
                Utility.objForEach(vector, function(axis, value) {



                    _self.camera.position[axis] += value;
                });
            }

            if(this.cameraLocked){
            	this.camera.lookAt(this.playerModel.position);
            }

		};


		/**
		 * Rotates the camera based on the given input
		 */
		this.rotateCamera = function(rotation){

			if(rotation.vertical != 0 || rotation.horizontal != 0){
				console.log("rotating!");
                
                // console.log("rotating camera", this.camera.position);

                var cameraPositionRelativeToZero = new THREE.Vector3(
                    this.camera.position.x - this.playerModel.position.x,
                	this.camera.position.y - this.playerModel.position.y,
                    this.camera.position.z - this.playerModel.position.z
                    );


                var alpha = rotation.horizontal;

                var rotationMatrix = Utility.getYRotationMatrix(alpha);


                var cameraPositionChange = cameraPositionRelativeToZero.applyMatrix3(rotationMatrix);

                this.camera.position.x = cameraPositionChange.x + this.playerModel.position.x;
                this.camera.position.y = cameraPositionChange.y + this.playerModel.position.y;
                this.camera.position.z = cameraPositionChange.z + this.playerModel.position.z;


	            if(this.cameraLocked){
	            	this.camera.lookAt(this.playerModel.position);
	            }
            }
		};







	};
