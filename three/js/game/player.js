define(["controller", "util", "playermodel", "playercamera"], 
    function(Controller, Utility, PlayerModel, PlayerCamera) {


    var player = function(){


        this.controller = null;
        this.playerModel = null;
        this.playerCamera = null;

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


            this.controller = new Controller();
            this.controller.loadConnections();
        };



        /**
         * updates the model and camera location based on input submitted by the controller
         */
        this.updatePlayer = function() {

            var input = this.controller.getUserInputRelativeToPlayer();


            //format movement input to work according to the current rotation.
            var currentAlpha = this.playerModel.model.rotation.y;

            //console.log(this.playerModel.model.rotation);
            input.movement = input.movement.applyMatrix3(Utility.getYRotationMatrix(currentAlpha));


            //movement
            this.playerModel.moveModel(input.movement);

            this.playerCamera.moveCamera(input.movement);

            //rotation
            this.playerModel.rotateModel(input.rotation);

            this.playerCamera.rotateCamera(input.rotation);
        };



    }
    return player;

});