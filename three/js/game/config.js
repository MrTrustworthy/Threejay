define(function(){

    var config = {

        
        
        movementSpeed: 2,

        rotationSpeed: 2,


        /**
         * maps the keys to the appropriate actions like left right down 
         * @type {Object}
         */
        keyMap: {
            a: "left",
            w: "forward",
            s: "back",
            d: "right",
            c: "down",
            " ": "up",

            e: "rotate_right",
            q: "rotate_left",
            v: "rotate_up",
            b: "rotate_down"
        }


    }
    return config





});