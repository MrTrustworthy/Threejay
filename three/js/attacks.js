var Attack = function(){


	this.attackname = null;
	this.attackcolor = null;
	this.range = null;
	this.spread = null;
	this.lastUsedAt = null
	this.damage = null;
	this.isPiercing = null;

	/**
	 * loads an attack
	 */
	this.load = function(attackname, range, spread, color, cooldown, damage, projectileAmount, fadingTime, isPiercing){
		this.attackname = attackname;
		this.range = range;
		this.spread = spread;
		this.cooldown = cooldown;
		this.color = color;
		this.projectileAmount = projectileAmount;
		this.fadingSteps = fadingTime/16; //~60 frames per second
		this.damage = damage;
		this.isPiercing = isPiercing;

		this.lastUsedAt = 0;
	};



	/** 
	 * fires an attack and adds into into the scene
	 * 
	 */
	this.executeAttack = function(playerModel, scene){

		var _self = this;

		var now = new Date().getTime();


		// Check for cooldowns
		if( this.lastUsedAt + this.cooldown >= now ){
			console.log(this.attackname, 
				" is still on cooldown for ",
				 ((this.lastUsedAt + this.cooldown) - now)
				 );
			return;
		}

		console.log("firing action: ", this.attackname);

		for(var i = 1; i <= this.projectileAmount; i++){

			var translate = new THREE.Vector3(
		        Utility.randomInt(this.spread, true),
		        Utility.randomInt(this.spread, true), 
		        this.range
		        ).applyMatrix3(
		        Utility.getYRotationMatrix(playerModel.rotation.y));

		    //setup the default target, if nothing gets hit this will be used
		    var targets = [ new THREE.Vector3(
		        playerModel.position.x + translate.x,
		        playerModel.position.y + translate.y,
		        playerModel.position.z + translate.z
		        ) ];




		    //---------------------------

		    // RAYCASTING TO CHECK FOR OBJECTS ALONG THE LINE
		    var directionVector = translate.normalize(); //new THREE.Vector3(0, 0, 0).subVectors(target, playerModel.position).normalize();
		    var raycaster = new THREE.Raycaster(playerModel.position, directionVector, 0, this.range);

		    var objectsHit = [];
		    raycaster.intersectObjects(scene.children).forEach(function(element, index){
		    	if(element.object.isGameobject 
		    		&& element.object.isHittable 
		    		&& !element.object.isPlayer 
		    		&& !element.object.isDead){

		    		objectsHit.push(element);
		    	}
		    });

		    // if anything has been hit
		    if(objectsHit.length > 0){

		    	console.log("hit:", objectsHit);
		    
		    	//if the attack is not piercing, we only want ONE element
			    if(!this.isPiercing){
			    	var firstIntersected = objectsHit[0];
			    	objectsHit.forEach(function(element){
			    		if(firstIntersected.distance > element.distance){
			    			firstIntersected = element;
			    		}
			    	});
			    	objectsHit = [firstIntersected];
			    //if the attack is piercing, we still only want ONE intersection of the same object
			    // as the attack normally has two (in and out)
			    } else {

			    	var bufferList = [];

					objectsHit.forEach(function(hitElement){

						var objectAlreadyThere = false;
						var indexOfElementWithObject = null;
						bufferList.forEach(function(bufferElement, index){
							if(bufferElement.object.id === hitElement.object.id){
								objectAlreadyThere = true;
								indexOfElementWithObject = index;
							}
						});
						if(!objectAlreadyThere){
							bufferList.push(hitElement);
						}else{

							if( bufferList[indexOfElementWithObject].distance > hitElement.distance ){
								bufferList[indexOfElementWithObject] = hitElement;
							}
						}
					});
					objectsHit = bufferList;

			    }

			    //calculate the effects for each object that has been hit

			    targets = []; //resetting targets for attack-line

			    objectsHit.forEach(function(element){

			    	element.object.health -= _self.damage;
			    	console.log("Hit object for", _self.damage, " now has ", element.object.health, " hp");

			    	if(element.object.health <= 0){
			    		element.object.isDead = true;
			    		// element.object.material.transparent = true;
			    		// element.object.material.opacity = 1;
			    		element.object.isFading = true;
			    		element.object.fadingSteps = 20;

			    		console.log("OMG THEY KILLED ELEMENT. YOU BASTERDS!");
			    	}

			    	// create a little hit effect
			    	var cMaterial = new THREE.MeshBasicMaterial({ 
			    		color: _self.color,
			    		transparent: true,
			    		opacity: 1.0
			    	}); 

			    	var sphereGeo = new THREE.SphereGeometry( 3,16,16 ); //works
			    	var hitEffect = new THREE.Mesh( sphereGeo, cMaterial );
			    	hitEffect.position.x = element.point.x;
			    	hitEffect.position.y = element.point.y;
			    	hitEffect.position.z = element.point.z;
			    	hitEffect.isFading = true;
			    	hitEffect.fadingSteps = _self.fadingSteps;
			    	scene.add( hitEffect );

			    	//calculate the attack-animation-line based on the points hit
			    	targets.push(element.point);



			    });
		    } // end of "if anything has been hit"


		    //drawing attack animation based on the targets
		    var material = new THREE.MeshBasicMaterial({
		            color: this.color,
		            transparent: true,
		            opacity: 1
		        })

		    // this draws a colored line between the player and a target position
		    var attackGeometry = new THREE.Geometry();
		    attackGeometry.vertices.push(playerModel.position); // Origin of the line

		    targets.forEach(function(target){
		    	attackGeometry.vertices.push(target); // target of the ray
		    });
		    

		    var attackGeometry = new THREE.Line(attackGeometry, material);

		    attackGeometry.isFading = true;
		    attackGeometry.fadingSteps = this.fadingSteps;
		    scene.add(attackGeometry);


	    } //end of "projectile for"


	    this.lastUsedAt = now;

	};

	/**
	 * Used as a place to store/load attacks.
	 */
	// this.loadPrebuiltAttack = function(attackname){

	// 	switch(attackname){ //attackname, range, spread, color, cooldown, damage, projectileAmount, fadingTime, ispiercing
	// 		case "Sniper":
	// 			this.load("LASER!", 400, 0, 0xffffff, 1000, 350, 1, 800, false); break;
	// 		case "Strike": 
	// 			this.load("Punch Him!", 50, 15, 0x00ff00, 50, 20, 1, 80, false); break;
	// 		case "Fireball": 
	// 			this.load("KAWOOOOOM!", 200, 10, 0xff0000, 5000, 800, 1, 2000, true); break;
	// 		case "Kick": 
	// 			this.load("Shotgun!!", 180, 50, 0x0000ff, 1500, 20, 12, 800, false); break;
	// 	}
	// }


};