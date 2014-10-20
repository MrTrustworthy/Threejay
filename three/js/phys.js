var GamePhysics = function(physicsConfig){

	this.physicsConfig = physicsConfig;


	/**
	 * Blub
	 */
	this.processPhysics = function(scene){

		var _self = this;

		scene.children.forEach(function(element, index){

			if(element.isPlayer){
            		element.playerReference.applyGravityToPlayer(
            			_self.physicsConfig.gravity.selected
            			);



			//Gravity
            }else if(element.hasGravity && element.position.y > element.relativeZeroHeight){


            	element.position.y -= _self.physicsConfig.gravity.selected;
            	            

                // if the element is already below 0
                if(element.position.y < element.relativeZeroHeight){
                	element.position.y = element.relativeZeroHeight;
                }
            }

            // Hit-effects
            if(element.isFading){
            	if(element.material.opacity > 0){
            		element.material.opacity -= 1/element.fadingSteps;
            		element.material.needsUpdate = true;
            	}else if(element.material.opacity <= 0){
            		scene.remove(element);
            	}           	
            }

        });


	};










};