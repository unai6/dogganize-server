const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: [true, "Email is mandatory and unique"], unique: true },
    password: { type: String },
    userTodos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User;