
    var Player = function(){


        this.controller = null;
        this.playerModel = null;
        this.playerCamera = null;
        this.scene = null;

        /**
         * loads the player into the given scene
         */
        this.loadPlayer = function(scene){

            console.log("loading player", this);

            this.playerModel = new PlayerModel();
            this.playerModel.loadModel();
            scene.add(this.playerModel.model);

            this.playerCamera = new PlayerCamera();
            this.playerCamera.loadCamera(this.playerModel.model);


            this.controller = new GameController();
            this.controller.loadConnections();

            this.scene = scene;
        };



        /**
         * updates the model and camera location based on input submitted by the controller
         */
        this.updatePlayer = function() {

            var input = this.controller.getUserInputRelativeToPlayer();


            //format movement input to work according to the current rotation.
            var currentRotation = this.playerModel.model.rotation.y;

            // translate the given movement coordinates to the coordinates calculated based
            // on the current player rotation
            input.movement = input.movement.applyMatrix3(Utility.getYRotationMatrix(currentRotation));


            //movement
            this.playerModel.moveModel(input.movement);

            this.playerCamera.moveCamera(input.movement);



            //rotation
            this.playerModel.rotateModel(input.rotation);

            this.playerCamera.rotateCamera(input.rotation);
        };



    }


