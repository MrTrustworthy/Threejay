

    var Utility = {

        /**
         * Standart Vector for Y-Rotation-Axis
         */

        yRotationAxisVector: new THREE.Vector3(0, 1, 0),

        /**
         * provides a function to loop through objects
         */
        objForEach: function(obj, callback){
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    callback(key, obj[key]);
                }
            }
        },

        /**
         * returns a random int from 0 to (including) int
         * @param  {[type]} int [description]
         * @return {[type]}     [description]
         */
        randomInt: function(maxInt, negativeAllowed){
            var x = Math.floor(Math.random()*(maxInt+1));
            if(negativeAllowed){
                x = Math.random() < 0.5 ? x : -x;
            }
            return x;
        },

        /**
         * returns a Y-rotation matrix
         */
        getYRotationMatrix: function(alpha){
            return new THREE.Matrix3(
                Math.cos(alpha), 0, Math.sin(alpha), 
                0, 1, 0, 
                -Math.sin(alpha), 0, Math.cos(alpha)
                );
        },

        /**
         * Not used so far
         */
        getZRotationMatrix: function(alpha){
            return new new THREE.Matrix3(
                Math.cos(alpha), -Math.sin(alpha), 0, 
                Math.sin(alpha), Math.cos(alpha), 0, 
                0, 0, 1
                );
        },



        roundToDecimals: function(number, amountOfDecimals){

            return Math.round(number * 1000)/1000;
        },


        /**
         * Returns a random (one of 4) material object for the Gameobjects
         */
        getRandomSubstance: function(){
            var x = Math.floor(Math.random()*4) + 1;

            var matName;

            switch(x){
                case 1: matName = "SoftWood"; break;
                case 2: matName = "Box"; break;
                case 3: matName = "Stone"; break;
                case 4: matName = "Metal"; break;
            }



            var material = {
                name: matName,
                strength: (x*x)
            }

            return material;


        }






    }
