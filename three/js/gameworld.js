

 

    var GameWorld = function(){

        
        this.loadWorld = function(scene){

            for(var i = 0; i < 20; i++){
                var geometry = new THREE.BoxGeometry(Utility.randomInt(40)+2, Utility.randomInt(40)+2, Utility.randomInt(25)+2)
                var material = new THREE.MeshBasicMaterial({
                        map: THREE.ImageUtils.loadTexture("media/textures/simple.jpeg"),
                        side: THREE.DoubleSide
                    })
                var gameobject = new Physijs.BoxMesh(
                    geometry, 
                    material, 
                    200
                    );
                //gameobject.overdraw = true;
                gameobject.position.x = Utility.randomInt(150, true);               
                gameobject.position.z = Utility.randomInt(150, true);                
                gameobject.position.y += (gameobject.geometry.parameters.height/2) + Utility.randomInt(50, true);

                scene.add( gameobject );


            }

            var geometry = new THREE.BoxGeometry(1000, 1, 1000);
            var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("media/textures/floor3.jpg"),
                })

            var plane = new Physijs.BoxMesh(
                geometry, 
                material, 
                0
                );
            plane.receiveShadow = true;
            scene.add(plane);


            var light = new THREE.AmbientLight( 0x000000 ); 
            scene.add( light );


            var fog = new THREE.Fog(0x000000, 120, 350);
            scene.fog = fog;

        };





    }
