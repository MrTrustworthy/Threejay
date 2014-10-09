var GamePhysics = function(){


	this.processPhysics = function(scene){

		scene.children.forEach(function(element, index){

            if(element.hasGravity && 
            	element.position.y > element.relativeZeroHeight){

                element.position.y -= Config.gravity * element.mass;
            }

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