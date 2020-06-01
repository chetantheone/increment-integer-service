const mongoose = require('mongoose');
const {
	Schema
} = mongoose;

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	created_on: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: Number,
		default: 1 // for disable 0
	},
	schema_version: {
		type: Number,
		default: 1
	}
});

module.exports = mongoose.model('user', UserSchema);