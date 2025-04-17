const mongoose = require('mongoose');
const passport = require('passport');
// const bcrypt = require('bcrypt');


const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    aadhar:{
        type: Number,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default: 0
    }
})



const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;