
const axios = require('axios');

async function fetchQuotesByCategory(category) {
    try {
        // Fetch data from the API endpoint
        const response = await axios.get(`https://api.jsonbin.io/v3/b/6602ac54fe36e24a20a8143f?category=${category}`);

        // Check if response data exists and is an array
        if (!response.data || !Array.isArray(response.data.record)) {
            throw new Error("Invalid response data format");
        }

        // Filter quotes based on the specified category
        const filteredQuotes = response.data.record.filter(quote => quote.category === category);

        // Check if there are quotes available for the specified category
        if (filteredQuotes.length === 0) {
            throw new Error("No quotes found for the specified category");
        }

        // Generate a random index within the range of the filtered quotes array length
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);

        // Return the title of the randomly selected quote
        return filteredQuotes[randomIndex].quote_title;
    } catch (error) {
        // If an error occurs during the process, throw an error
        throw new Error("Failed to fetch random quote by category: " + error.message);
    }
};

module.exports = { fetchQuotesByCategory };