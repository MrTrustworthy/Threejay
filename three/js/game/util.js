define(function(){

    var utility = {

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
        randomInt: function(intNr, negativeAllowed){
            var x = Math.floor(Math.random()*(intNr+1));
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
            return new Tnew THREE.Matrix3(
                Math.cos(alpha), -Math.sin(alpha), 0, 
                Math.sin(alpha), Math.cos(alpha), 0, 
                0, 0, 1
                );
        },



        roundToDecimals: function(number, amountOfDecimals){

            return Math.round(number * 1000)/1000;
        }






    }
    return utility





});