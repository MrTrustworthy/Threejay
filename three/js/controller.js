
    
    var GameController = function(){


        this.pressedKeys = [];

        this.mouseLookActive = false;

        this.oldMousePosition = {x:0, y:0};

        this.horizontalRotation = 0;






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

            //stuff we need as container
            input = {};
            input.movement = new THREE.Vector3(0,0,0);
            input.rotation = {
                horizontal: 0,
                vertical: 0
            };
            input.playeractions = [];

            var raw_input = this._getUserInput();

            //hand over keyboard input
            raw_input.forEach(function(element, index){
                if (element == "up"){ input.movement.y += Config.movementSpeed }
                else if (element == "down"){ input.movement.y -= Config.movementSpeed }
                else if (element == "right"){ input.movement.x -= Config.movementSpeed }
                else if (element == "left"){ input.movement.x += Config.movementSpeed }
                else if (element == "forward"){ input.movement.z += Config.movementSpeed }
                else if (element == "back"){ input.movement.z -= Config.movementSpeed }
                    
                else if (element.indexOf("attack") > -1){ input.playeractions.push(element)}

                // else if (element == "attack_1"){ input.playeractions.push("attack_1") }
                // else if (element == "attack_2"){ input.playeractions.push("attack_2") }
            });

            //hand over mouse input
            input.rotation.horizontal -= (this.horizontalRotation/200) * Config.mouseSpeed;
            this.horizontalRotation = 0;

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
            };

            /**
             * removes the pressed key from .pressedKeys
             */ 
            document.onkeyup = function(evt){
                _self.pressedKeys.forEach(function(element, index){
                    if(element == evt.key){
                        _self.pressedKeys.splice(index, 1);
                    }
                });
            };


            // MOUSE HANDLERS!!!!
            document.onmousedown = function(evt){
                _self.mouseLookActive = true;
                _self.oldMousePosition.x = evt.pageX;
                _self.oldMousePosition.y = evt.pageX;
                document.body.style.cursor = "none";

            };

            document.onmouseup = function(evt){
                _self.mouseLookActive = false;
                _self.oldMousePosition.x = 0;
                _self.oldMousePosition.y = 0;
                document.body.style.cursor = "";
            };

            document.onmousemove = function(evt){
                if(_self.mouseLookActive){
                    _self.horizontalRotation += evt.pageX - _self.oldMousePosition.x;
                    _self.oldMousePosition.x = evt.pageX;
                    _self.oldMousePosition.y = evt.pageX;
                }
            };

        };





    }
