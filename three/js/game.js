        


        console.log("loading game");

        Physijs.scripts.worker = "js/physijs_worker.js";
        Physijs.scripts.ammo = "ammo.js";


        var scene = new Physijs.Scene();
        console.log("loaded scene", scene);
        
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);



        var world = new GameWorld();
        world.loadWorld(scene);

        var player = new Player();
        player.loadPlayer(scene);



        function gameLoop() { 

                       
            player.updatePlayer();
            scene.simulate();
            renderer.render(scene, player.playerCamera.camera); 
            requestAnimationFrame(gameLoop);  
            
            
        }
        gameLoop();
          
        document.body.appendChild(renderer.domElement);
  
