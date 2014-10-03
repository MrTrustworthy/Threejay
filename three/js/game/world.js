define(["util"], function(Util){

 

    var world = function(){

        

        
        this.loadWorld = function(scene){

            for(var i = 0; i < 50; i++){

                var texture = THREE.ImageUtils.loadTexture("media/textures/ice.jpg");
                texture.warpS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.repeat.set(1,2);

                var plane = new THREE.Mesh(
                    new THREE.BoxGeometry(Util.randomInt(40), Util.randomInt(40), Util.randomInt(25)), 
                    new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    })
                );
                //plane.overdraw = true;
                plane.position.x = Util.randomInt(200, true);               
                plane.position.z = Util.randomInt(200, true);
                
                plane.position.y += plane.geometry.parameters.height/2;

                scene.add( plane );

            }


            var texture = THREE.ImageUtils.loadTexture("media/textures/floor3.jpg");
            texture.warpS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.repeat.set(1,2);

            var plane = new THREE.Mesh(
                new THREE.BoxGeometry(1000, 1, 1000), 
                new THREE.MeshBasicMaterial({
                    map: texture,
                    //side: THREE.DoubleSide,
                    //color: 0x000000
                })
            );
            scene.add(plane);




            var light = new THREE.AmbientLight( 0x000000 ); 
            scene.add( light );


            var fog = new THREE.Fog(0x000000, 120, 350);
            scene.fog = fog;

        };





    }







    return world;

});