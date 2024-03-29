const mongoose = require("mongoose");

const surveyResponseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    // timeInterval: {
    //     type: String,
    //     required: true
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register', // Reference to the user model
        required: true
    }
});

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseSchema);

module.exports = SurveyResponse;
