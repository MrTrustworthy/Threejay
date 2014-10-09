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

		    var target = new THREE.Vector3(
		        playerModel.position.x + translate.x,
		        playerModel.position.y + translate.y,
		        playerModel.position.z + translate.z
		        );


		    var material = new THREE.MeshBasicMaterial({
		            color: this.color,
		            transparent: true,
		            opacity: 1
		        })

		    // this draws a colored line between the player and a target position
		    var attackGeometry = new THREE.Geometry();
		    attackGeometry.vertices.push(playerModel.position); // Origin of the line
		    attackGeometry.vertices.push(target); // target of the ray

		    var attackGeometry = new THREE.Line(attackGeometry, material);

		    attackGeometry.isFading = true;
		    attackGeometry.fadingSteps = this.fadingSteps;
		    scene.add(attackGeometry);


		    // RAYCASTING TO CHECK FOR OBJECTS ALONG THE LINE
		    var directionVector = new THREE.Vector3(0, 0, 0).subVectors(target, playerModel.position).normalize();
		    var raycaster = new THREE.Raycaster(playerModel.position, directionVector, 0, this.range);

		    var objectsHit = [];
		    raycaster.intersectObjects(scene.children).forEach(function(element, index){
		    	if(element.object.isGameobject 
		    		&& element.object.isHittable 
		    		&& !element.object.isPlayer 
		    		&& !element.object.isDead){

		    		//objects always get intersected twice (in and out)
		    		// make sure we have the same object only once in the array
		    		if( objectsHit.indexOf(element) == -1 ){
		    			objectsHit.push(element);
		    		}
		    	}
		    });

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
			    }


			    objectsHit.forEach(function(element){
			    	element.object.health -= _self.damage;
			    	console.log("Hit object for", _self.damage, " now has ", element.object.health, " hp left");
			    	if(element.object.health <= 0){
			    		element.object.isDead = true;
			    		element.object.material.transparent = true;
			    		element.object.material.opacity = 1;
			    		element.object.isFading = true;
			    		element.object.fadingSteps = 20;

			    		console.log("OMG THEY KILLED ELEMENT. YOU BASTERDS!");
			    	} 
			    });
		    }


	    }


	    this.lastUsedAt = now;

	};

	/**
	 * Used as a place to store/load attacks.
	 */
	this.loadPrebuiltAttack = function(attackname){

		switch(attackname){ //attackname, range, spread, color, cooldown, damage, projectileAmount, fadingTime, ispiercing
			case "Sniper":
				this.load("LASER!", 400, 0, 0xffffff, 1000, 100, 1, 800, false); break;
			case "Strike": 
				this.load("Punch Him!", 50, 15, 0x00ff00, 100, 8, 2, 80, true); break;
			case "Fireball": 
				this.load("KAWOOOOOM!", 200, 10, 0xff0000, 5000, 800, 1, 2000, true); break;
			case "Kick": 
				this.load("KICK!", 90, 8, 0x0000ff, 250, 20, 1, 150, true); break;
		}
	}


};