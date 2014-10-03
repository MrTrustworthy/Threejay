        

require(["world", "player", "./../libs/three"], function(World, Player){






        var scene = new THREE.Scene();
        
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);



        var world = new World();
        world.loadWorld(scene);

        var player = new Player();
        player.loadPlayer(scene);


        function gameLoop() { 

            requestAnimationFrame(gameLoop); 

            player.updatePlayer();

            renderer.render(scene, player.playerCamera.camera); 
        }
        gameLoop();
          
        document.body.appendChild(renderer.domElement);
  




    
});