define(["config"], function(Config) {
    
    var controller = function(){


        this.pressedKeys = [];


        /** 
         * Internal function that transforms the pressed keys into
         * an array of commands (up, down, turnright)
         */
        this._getUserInput = function(){
            var _self = this;
            var input = [];
            this.pressedKeys.forEach(function(element, index){
                if(element){
                    input.push(Config.keyMap[element]);
                }
            });
            return input;
        };


        /**
         * returns an vector with the requested movement and rotation information
         */
        this.getUserInputRelativeToPlayer = function(){

            input = {};
            input.movement = new THREE.Vector3(0,0,0);
            input.rotation = {
                horizontal: 0,
                vertical: 0
            }

            var raw_input = this._getUserInput();

            raw_input.forEach(function(element, index){
                if (element == "up"){ input.movement.y += Config.movementSpeed }
                else if (element == "down"){ input.movement.y -= Config.movementSpeed }
                else if (element == "right"){ input.movement.x -= Config.movementSpeed }
                else if (element == "left"){ input.movement.x += Config.movementSpeed }
                else if (element == "forward"){ input.movement.z += Config.movementSpeed }
                else if (element == "back"){ input.movement.z -= Config.movementSpeed }

                else if (element == "rotate_up"){ input.rotation.vertical += Config.rotationSpeed }
                else if (element == "rotate_down"){ input.rotation.vertical -= Config.rotationSpeed }
                else if (element == "rotate_right"){ input.rotation.horizontal -= Config.rotationSpeed }
                else if (element == "rotate_left"){ input.rotation.horizontal += Config.rotationSpeed }

            });

            return input;
        };






        /**
         * Connects this class to the window to catch key inputs.
         *
         * @return {[type]} [description]
         */
        this.loadConnections = function(){

            console.log("Connecting controller to the DOM");
            var _self = this;

            /**
             * saves the pressed key into .pressedKeys
             */ 
            document.onkeydown = function(evt){               
                var alreadyThere = false;
                _self.pressedKeys.forEach(function(element, index){
                    if(element == evt.key){ alreadyThere = true; }                   
                });
                if(!alreadyThere){
                    _self.pressedKeys.push(evt.key);
                }
            }

            /**
             * removes the pressed key from .pressedKeys
             */ 
            document.onkeyup = function(evt){
                _self.pressedKeys.forEach(function(element, index){
                    if(element == evt.key){
                        _self.pressedKeys.splice(index, 1);
                    }
                });
            }
        };

    }
    return controller;
});