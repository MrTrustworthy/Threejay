define(function(){

    var utility = {

        
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
        }


    }
    return utility





});