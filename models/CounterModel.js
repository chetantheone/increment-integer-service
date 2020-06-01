const mongoose = require('mongoose');
const {
	Schema
} = mongoose;

const counterSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	created_on: {
		type: Date,
		default: Date.now,
	},
	counter: {
		type: Number,
		default: 0 // for disable 0
	},
	schema_version: {
		type: Number,
		default: 1
	}
});

module.exports = mongoose.model('counter', counterSchema);