
    
    var GameController = function(controllerConfig){


        this.pressedKeys = [];

        this.mouseLookActive = false;

        this.oldMousePosition = {x:0, y:0};

        this.horizontalRotation = 0;

        this.controllerConfig = controllerConfig;




        /**
         * returns an vector with the requested movement and rotation information
         */
        this.getUserInputRelativeToPlayer = function(){

            var _self = this;

            var raw_input = [];
            this.pressedKeys.forEach(function(element, index){
                if(element){
                    raw_input.push(_self.controllerConfig.keyMap[element]);
                }
            });



            //stuff we need as container
            input = {};
            input.movement = new THREE.Vector3(0,0,0);
            input.rotation = {
                horizontal: 0,
                vertical: 0
            };
            input.playeractions = [];

            //hand over keyboard input
            raw_input.forEach(function(element, index){
                if(!element){return}

                
                if (element == "up"){ input.movement.y += 1 }
                else if (element == "down"){ input.movement.y -= 1 }
                else if (element == "right"){ input.movement.x -= 1 }
                else if (element == "left"){ input.movement.x += 1 }
                else if (element == "forward"){ input.movement.z += 1 }
                else if (element == "back"){ input.movement.z -= 1 }
                    
                else if (element == "jump"){ input.playeractions.push(element)}
                    
                else if (element.indexOf("attack") > -1){ input.playeractions.push(element)}
            });

            //hand over mouse input
            input.rotation.horizontal -= 
                (this.horizontalRotation/200) * 
                controllerConfig.mouseSpeed.selected;
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
                    if(element == evt.keyCode){ alreadyThere = true; }                   
                });
                if(!alreadyThere){
                    _self.pressedKeys.push(evt.keyCode);
                }
            };

            /**
             * removes the pressed key from .pressedKeys
             */ 
            document.onkeyup = function(evt){
                _self.pressedKeys.forEach(function(element, index){
                    if(element == evt.keyCode){
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
