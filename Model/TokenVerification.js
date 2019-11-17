const mongoose =  require('mongoose');

let TokenSchema =  mongoose.Schema ({
    _userId   : { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token     : { type: String, required: true },
    createdAt : { type: Date, required: true, default: Date.now, expires: 43200 }
});


let TokenModel = mongoose.model('Token', TokenSchema , 'tokens');

module.exports = TokenModel ; 