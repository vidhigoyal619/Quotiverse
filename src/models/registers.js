const mongoose = require("mongoose");

const randomQuoteSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type :Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    surveyResponses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyResponse' // Reference to the survey response model
    }]
});

const Register = mongoose.model("Register", randomQuoteSchema);
module.exports = Register;
