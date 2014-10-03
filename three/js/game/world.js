define(["util"], function(Util){

 

    var world = function(){

        

        
        this.loadWorld = function(scene){

            for(var i = 0; i < 20; i++){
                var plane = new THREE.Mesh(
                    new THREE.BoxGeometry(Util.randomInt(25), Util.randomInt(25), Util.randomInt(25)), 
                    new THREE.MeshLambertMaterial({side: THREE.DoubleSide})
                    );
                //plane.overdraw = true;
                plane.position.x = Util.randomInt(100, true);
                
                plane.position.z = Util.randomInt(100, true);
                scene.add( plane );
                plane.position.y += plane.geometry.parameters.height/2;
            }

            var plane = new THREE.Mesh(
                new THREE.BoxGeometry(2000, 1, 2000), 
                new THREE.MeshNormalMaterial({
                    side: THREE.DoubleSide,
                    color: 0x000000
                })
                );
            scene.add(plane);

            var light = new THREE.AmbientLight( 0x0fff04 ); 
            scene.add( light );

        };





    }







    return world;

});