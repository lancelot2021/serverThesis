const {Schema, model} = require('mongoose');

const AdminSchema = new Schema({
    login: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
});

module.exports = model('Admin', AdminSchema);