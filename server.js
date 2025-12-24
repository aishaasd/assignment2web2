const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

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

    // 2. Get country information
    let countryData = {};
    try {
      const countryResponse = await axios.get(
        `https://api.countrylayer.com/v2/name/${userData.country}`,
        {
          params: {
            access_key: process.env.COUNTRYLAYER_API_KEY
          }
        }
      );

      if (countryResponse.data && countryResponse.data.length > 0) {
        const country = countryResponse.data[0];
        countryData = {
          countryName: country.name || userData.country,
          capital: country.capital || 'N/A',
          languages: country.languages ? country.languages.map(lang => lang.name).join(', ') : 'N/A',
          currency: country.currencies && country.currencies.length > 0 ? country.currencies[0].code : null,
          flag: country.flag || null
        };
      }
    } catch (error) {
      console.error('Country API error:', error.message);
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