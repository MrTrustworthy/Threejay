

 

    var GameWorld = function(){

        
        this.gameworldObjects = [];
        
        this.loadWorld = function(scene){

            for(var i = 0; i < 20; i++){

                var texture = THREE.ImageUtils.loadTexture("media/textures/simple.jpeg");
                texture.warpS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.repeat.set(1,2);

                var gameobject = new Physijs.BoxMesh(
                    new THREE.BoxGeometry(Utility.randomInt(40)+2, Utility.randomInt(40)+2, Utility.randomInt(25)+2), 
                    new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    })
                );
                //gameobject.overdraw = true;
                gameobject.position.x = Utility.randomInt(150, true);               
                gameobject.position.z = Utility.randomInt(150, true);                
                gameobject.position.y += (gameobject.geometry.parameters.height/2) + Utility.randomInt(50, true);

                scene.add( gameobject );
                this.gameworldObjects.push(gameobject);

            }



            // FLOOR
            var texture = THREE.ImageUtils.loadTexture("media/textures/floor3.jpg");
            texture.warpS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.repeat.set(1,2);

            var plane = new Physijs.BoxMesh(
                new THREE.BoxGeometry(1000, 1, 1000), 
                new THREE.MeshBasicMaterial({
                    map: texture,
                    //side: THREE.DoubleSide,
                    //color: 0x000000
                }), 0);
            plane.receiveShadow = true;

            scene.add(plane);
            this.gameworldObjects.push(plane);



            var light = new THREE.AmbientLight( 0x000000 ); 
            scene.add( light );


            // var fog = new THREE.Fog(0x000000, 120, 350);
            // scene.fog = fog;

        };





    }
