
define(["util"], function(Utility){



	var playerModel = function(){

		this.model = null;



		/**
		 * This loads the model
		 */
		this.loadModel = function(){
			console.log("Loading player model");



            this.model = new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.MeshNormalMaterial({
                    color: 0x00ff00,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                })
            );

            this.model.position.y += this.model.geometry.parameters.height / 2;


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
            }

		};


		/**
		 * rotates the model based on a given rotation object
		 */
		this.rotateModel = function(rotation){

			if(rotation.horizontal != 0){
                
                var alpha = rotation.horizontal;

                //this.model.rotateY(Utility.roundToDecimals(alpha));
                // replaced by:
                this.model.rotation.y = Utility.roundToDecimals(this.model.rotation.y + alpha);
            }
		};
 


	};

	return playerModel;

});