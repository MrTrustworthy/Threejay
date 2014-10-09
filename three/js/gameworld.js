

 

    var GameWorld = function(){

        
        this.loadWorld = function(scene){

            for(var i = 0; i < 50; i++){

                var geometry = new THREE.BoxGeometry(
                    Utility.randomInt(40)+2, 
                    Utility.randomInt(40)+2, 
                    Utility.randomInt(25)+2
                    );

                var material = new THREE.MeshBasicMaterial({
                        map: THREE.ImageUtils.loadTexture("media/textures/simple.jpeg"),
                        side: THREE.DoubleSide
                    });

                var gameobject = new THREE.Mesh(
                        geometry, 
                        material
                    );
                gameobject.position.x = Utility.randomInt(250, true);               
                gameobject.position.z = Utility.randomInt(250, true);                
                gameobject.position.y += (gameobject.geometry.parameters.height / 2) + Utility.randomInt(50);
                
                
                //this is for the physics and stuff. 
                gameobject.hasGravity = true;
                gameobject.relativeZeroHeight = gameobject.geometry.parameters.height / 2;
                gameobject.mass =  
                    (gameobject.geometry.parameters.width +
                    gameobject.geometry.parameters.height +
                    gameobject.geometry.parameters.depth) / 10;

                gameobject.isGameobject = true;
                gameobject.isHittable = true;
                gameobject.health = gameobject.geometry.parameters.width +
                    gameobject.geometry.parameters.height +
                    gameobject.geometry.parameters.depth;



                scene.add( gameobject );


            }

            // create the floor
            var geometry = new THREE.BoxGeometry(1000, 0.1, 1000);
            var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("media/textures/floor3.jpg"),
                });

            var plane = new THREE.Mesh(
                    geometry, 
                    material
                );
            plane.receiveShadow = true;
            scene.add(plane);


            var light = new THREE.AmbientLight( 0x000000 ); 
            scene.add( light );


            var fog = new THREE.Fog(0x000000, 120, 350);
            scene.fog = fog;

        };





    }
