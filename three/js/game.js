        






        loadGame = function(){
            console.log("loading game");

            scene = new THREE.Scene();
            console.log("loaded scene", scene);
            
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(window.innerWidth, window.innerHeight);


            world = new GameWorld();
            world.loadWorld(scene);

            player = new Player();
            player.loadPlayer(scene);


            gamePhysics = new GamePhysics();

            document.body.appendChild(renderer.domElement);

        };
        





        startGame = function() { 

                       
            player.updatePlayer();
            gamePhysics.processPhysics(scene);
            renderer.render(scene, player.camera); 
            requestAnimationFrame(startGame);  
            
            
        };
