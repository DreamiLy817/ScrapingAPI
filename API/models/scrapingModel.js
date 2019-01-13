'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClothSchema = new Schema({
    idItem: { type: String, required: true },
	title: { type: String, required: true},
	url: { type: String, required: true },
	image: {type: String,required: true },
	priceD: [
		[{ 
        prix: { type: String, required: true },
        currentDate: { type: Date, default: Date.now()}  
        }]
	]
});

 const clothModel = () => {
 	return mongoose.model('Vetements', ClothSchema);
 };

module.exports = mongoose.model('Vetements', ClothSchema);


