


	var PlayerModel = function(){

		this.model = null;



		/**
		 * This loads the model
		 */
		this.loadModel = function(){
			console.log("Loading player model");

			
			var texture = THREE.ImageUtils.loadTexture("media/textures/white.jpg");
			var material = new THREE.MeshBasicMaterial({
                    map: texture
                })

			var boxGeometry = new THREE.BoxGeometry(10, 10, 10)

            this.model = new Physijs.BoxMesh(boxGeometry, material, 20);

            this.model.position.y += (this.model.geometry.parameters.height / 2);

            this.model.castShadow = true;

            this.model.name = "Player";

            this.model.addEventListener("collision", function(a,b,c,d){
            	console.log("Collision!!!!");
            });

            this.model.addEventListener("onchange", function(a){
            	console.log("changed!!!");
            });


		};



		/**
		 * moves the model based on a given vector
		 */
		this.moveModel = function(vector){

			

			var _self = this;

			if(vector.x != 0 || vector.y != 0 || vector.z != 0 ){
                Utility.objForEach(vector, function(axis, value) {
                	_self.model.position[axis] += value;
                	
                });
                this.model.__dirtyPosition = true;
            }

		};


		/**
		 * rotates the model based on a given rotation object
		 */
		this.rotateModel = function(rotation){
			
			if(rotation.horizontal != 0){
                
                var alpha = rotation.horizontal;
                this.model.rotation.y = Utility.roundToDecimals(this.model.rotation.y + alpha);
                this.model.__dirtyRotation = true;
               
            }
		};
 


	};
