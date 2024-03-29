const axios = require('axios');
const SurveyResponse = require('./models/surveyResponse'); // Import the SurveyResponse model
const Register = require("./models/registers");

async function fetchQuotes() {
    try {
        // Get the email from the request body (assuming it's included in the request)
        const userEmail = req.body.email;

        // Find the user document from the registers collection based on the email
        const user = await Register.findOne({ email: userEmail });

        if (user) {
            const userId = user._id; // Use the user's _id as userId

            // Find the user's survey response document
            const surveyResponse = await SurveyResponse.findOne({ user: userId });

            if (surveyResponse) {
                // Extract the category from the survey response document
                const selectedCategory = surveyResponse.category;

                // Construct the API request options with the user's selected category
                const options = {
                    method: 'GET',
                    url: 'https://paperquotes.p.rapidapi.com/quotes',
                    headers: {
                        Authorization: '<REQUIRED>',
                        'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
                        'X-RapidAPI-Host': 'paperquotes.p.rapidapi.com'
                    },
                    params: {
                        tags: selectedCategory
                    }
                };

                // Make the API request
                const response = await axios.request(options);
                console.log(response.data);
            } else {
                console.log('User survey response not found');
            }
        } else {
            console.log('User not found in the registers collection');
        }
    } catch (error) {
        console.error('Error fetching user survey response:', error);
    }
}
const userEmail = req.body.email;
fetchQuotes(userEmail);
module.exports = fetchQuotes;
