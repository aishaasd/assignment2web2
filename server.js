const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Helper function to fetch country info from restcountries.com
async function fetchCountryInfo(countryName) {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`, {
            params: { fullText: false }
        });

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const country = response.data[0];

        const currencies = country.currencies ? Object.keys(country.currencies) : [];
        const languages = country.languages ? Object.values(country.languages) : [];
        const currencyCode = currencies.length > 0 ? currencies[0] : 'N/A';

        return {
            name: country.name.common || 'N/A',
            capital: country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A',
            languages: languages.length > 0 ? languages.join(', ') : 'N/A',
            currency: currencyCode,
            flag: country.flags?.png || country.flags?.svg || ''
        };
    } catch (error) {
        console.error('Error fetching country info:', error.message);
        return null;
    }
}

// API endpoint to get random user with all integrated data
app.get('/api/random-user', async (req, res) => {
    try {
        // 1. Get random user
        const userResponse = await axios.get('https://randomuser.me/api/');
        const user = userResponse.data.results[0];

        // Extract user data
        const userData = {
            firstName: user.name.first,
            lastName: user.name.last,
            gender: user.gender,
            profilePicture: user.picture.large,
            age: user.dob.age,
            dateOfBirth: new Date(user.dob.date).toLocaleDateString(),
            city: user.location.city,
            country: user.location.country,
            fullAddress: `${user.location.street.number} ${user.location.street.name}`
        };

        // 2. Get country information using restcountries.com
        let countryData = {};
        const countryInfo = await fetchCountryInfo(userData.country);
        
        if (countryInfo) {
            countryData = {
                countryName: countryInfo.name,
                capital: countryInfo.capital,
                languages: countryInfo.languages,
                currency: countryInfo.currency !== 'N/A' ? countryInfo.currency : null,
                flag: countryInfo.flag
            };
        } else {
            countryData = {
                countryName: userData.country,
                capital: 'N/A',
                languages: 'N/A',
                currency: null,
                flag: null
            };
        }

        // 3. Get exchange rates if currency is available
        let exchangeRates = {};
        if (countryData.currency) {
            try {
                const exchangeResponse = await axios.get(
                    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${countryData.currency}`
                );

                if (exchangeResponse.data && exchangeResponse.data.conversion_rates) {
                    exchangeRates = {
                        baseCurrency: countryData.currency,
                        usd: exchangeResponse.data.conversion_rates.USD || 'N/A',
                        kzt: exchangeResponse.data.conversion_rates.KZT || 'N/A'
                    };
                }
            } catch (error) {
                console.error('Exchange rate API error:', error.message);
                exchangeRates = {
                    baseCurrency: countryData.currency,
                    usd: 'N/A',
                    kzt: 'N/A'
                };
            }
        }

        // 4. Get news headlines
        let news = [];
        try {
            const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: userData.country,
                    language: 'en',
                    pageSize: 5,
                    apiKey: process.env.NEWS_API_KEY
                }
            });

            if (newsResponse.data && newsResponse.data.articles) {
                news = newsResponse.data.articles.map(article => ({
                    title: article.title || 'No title',
                    image: article.urlToImage || null,
                    description: article.description || 'No description available',
                    sourceUrl: article.url || '#'
                }));
            }
        } catch (error) {
            console.error('News API error:', error.message);
            news = [];
        }

        // Send combined response
        res.json({
            success: true,
            user: userData,
            country: countryData,
            exchangeRates: exchangeRates,
            news: news
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch data. Please try again.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});