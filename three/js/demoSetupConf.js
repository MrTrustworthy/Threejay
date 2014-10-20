var demo_config_test = {



	worldDetails: {

		amountOfObjects: {
			min: 0,
			max: 500,
			selected: 50
		},

		sizeOfObjects: {
			min: 20,
			max: 75
		},

		spreadOverArea: {
			min: 0,
			max: 500,
			selected: 500
		}


	},



	playerDetails: {

		model: {
			size: {
				min: 4,
				max: 20,
				selected: 8
			},
			mass: {
				min: 1,
				max: 200,
				selected: 5
			}
		},

		camera: {
			distance_x: {
				min: 0,
				max: 100,
				selected: 50
			},
			distance_y: {
				min: 0,
				max: 100,
				selected: 30
			}
		},

		movement: {
			speed: {
				min: 1,
				max: 20,
				selected: 3
			},
			acceleration: {
				min: 0.01,
				max: 1,
				selected: 0.15
			},

			jumping_power: {
				min: 1,
				max: 100,
				selected: 15
			}
		},

		rotation: {
			speed: {
				min: 0.001,
				max: 10,
				selected: 0.1
			}
		},

		controller: {
			keyMap: {
				"65": "left",
				"87": "forward",
				"83": "back",
				"68": "right",

				//"67": "down",

				"32": "jump",
				"69": "attack_1",
				"81": "attack_2",
				"82": "attack_3",
				"84": "attack_4"
			},
			mouseSpeed: {
				min: 0.001,
				max: 20,
				selected: 1
			}
		},



		attacks: [{
			index: 0,
			params: ["LASER!", 400, 0, 0xffffff, 1000, 350, 1, 800, false]
		}, {
			index: 1,
			params: ["Punch Him!", 50, 15, 0x00ff00, 50, 20, 1, 80, false]
		}, {
			index: 2,
			params: ["KAWOOOOOM!", 200, 10, 0xff0000, 5000, 800, 1, 2000, true]
		}, {
			index: 3,
			params: ["Shotgun!!", 180, 50, 0x0000ff, 1500, 20, 12, 800, false]
		}]


	},


	//details for the physics
	physicsDetails: {
		gravity: {
			min: 0,
			max: 20,
			selected: 3
		}


	}



}