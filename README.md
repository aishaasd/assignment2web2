# Random User API Integration Project

A comprehensive web application that generates random user profiles with integrated data from multiple APIs, including country information, currency exchange rates, and relevant news headlines.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Integration Details](#api-integration-details)
- [Design Decisions](#design-decisions)
- [Usage Guide](#usage-guide)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Overview

This project demonstrates the integration of four different REST APIs to create a cohesive user experience. When a user clicks the "Generate Random User" button, the application fetches a random user profile and enriches it with country data, currency exchange rates, and recent news articles related to the user's country.

## Features

### Assignment Requirements Met

1. Random User Generation (RandomUser.me API)
   - First name and last name
   - Gender
   - Profile picture
   - Age and date of birth
   - City, country, and full address

2. Country Information (Countrylayer API)
   - Country name
   - Capital city
   - Official language(s)
   - Currency code
   - National flag image

3. Currency Exchange Rates (ExchangeRate API)
   - Conversion to USD (United States Dollar)
   - Conversion to KZT (Kazakhstani Tenge)
   - Real-time rates based on user's local currency

4. News Headlines (News API)
   - Five latest news articles in English
   - Articles related to the user's country
   - Headline title, image, description, and source URL

5. Additional Features
   - Clean, responsive, and modern UI design
   - Proper error handling and loading states
   - Secure API key management with environment variables
   - Server-side API calls (no client-side API key exposure)
   - All business logic implemented in JavaScript files (not HTML)

## Technologies Used

### Backend
- Node.js - Runtime environment
- Express.js - Web application framework
- Axios - HTTP client for API requests
- dotenv - Environment variable management

### Frontend
- HTML5 - Markup structure
- CSS3 - Styling with modern layouts (Grid, Flexbox)
- Vanilla JavaScript - Client-side logic and DOM manipulation

## Project Structure

```

random-user-project/
├── server.js                 # Main server file with API logic
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (API keys)
├── .gitignore               # Git ignore file
├── public/                  # Static files served to client
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Styling and responsive design
│   └── script.js           # Client-side logic
└── README.md               # Project documentation

## Setup Instructions

### Prerequisites

- Node.js (version 14.x or higher)
- npm (comes with Node.js)
- Active internet connection
- API keys from the following services

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd random-user-project

# Or download and extract the ZIP file
````

### Step 2: Install Dependencies

```bash
npm install
```

This will install the following packages:

* express - Web server framework
* axios - HTTP client
* dotenv - Environment variable loader
* nodemon (dev dependency) - Auto-restart during development

### Step 3: Obtain API Keys

#### 3.1 Countrylayer API Key

1. Visit: [https://manage.countrylayer.com/signup/free](https://manage.countrylayer.com/signup/free)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API Access Key
5. Note: Free tier allows 100 requests/month

#### 3.2 Exchange Rate API Key

1. Visit: [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
2. Click "Get Free Key"
3. Enter your email address
4. Check your email for the API key
5. Note: Free tier allows 1,500 requests/month

#### 3.3 News API Key

1. Visit: [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key"
3. Register for a free account
4. Copy your API key from the dashboard
5. Note: Free tier allows 100 requests/day, developer accounts only

### Step 4: Configure Environment Variables

1. Open the .env file in the project root
2. Replace placeholder values with your actual API keys:

```env
COUNTRYLAYER_API_KEY=your_actual_countrylayer_key
EXCHANGE_RATE_API_KEY=your_actual_exchange_rate_key
NEWS_API_KEY=your_actual_news_api_key
```

Security Note: Never commit the .env file to version control. It's already included in .gitignore.

### Step 5: Start the Server

For production:

```bash
npm start
```

For development (with auto-restart):

```bash
npm run dev
```

You should see:

```
Server is running on http://localhost:3000
```

### Step 6: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## API Integration Details

### 1. Random User API

Endpoint: [https://randomuser.me/api/](https://randomuser.me/api/)

Method: GET

No API Key Required

Data Extracted:

* name.first - First name
* name.last - Last name
* gender - Gender
* picture.large - High-resolution profile picture
* dob.age - Age
* dob.date - Date of birth
* location.city - City
* location.country - Country
* location.street.number & location.street.name - Full address

Implementation Location: server.js (lines 16-33)

### 2. Countrylayer API

Endpoint: [https://api.countrylayer.com/v2/name/{country}](https://api.countrylayer.com/v2/name/{country})

Method: GET

Authentication: API key via query parameter

Parameters:

* access_key - Your API key
* Country name from Random User API

Data Extracted:

* name - Country name
* capital - Capital city
* languages[].name - Official languages
* currencies[0].code - Currency code
* flag - Flag image URL

Error Handling: Gracefully handles missing or unavailable data with fallback values.

Implementation Location: server.js (lines 35-57)

### 3. Exchange Rate API

Endpoint: [https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}](https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency})

Method: GET

Authentication: API key in URL path

Parameters:

* Base currency from Countrylayer API

Data Extracted:

* conversion_rates.USD - Rate to US Dollar
* conversion_rates.KZT - Rate to Kazakhstani Tenge

Formula: 1 [Base Currency] = X [Target Currency]

Conditional Logic: Only executes if currency code is available from Countrylayer API.

Implementation Location: server.js (lines 59-79)

### 4. News API

Endpoint: [https://newsapi.org/v2/everything](https://newsapi.org/v2/everything)

Method: GET

Authentication: API key via query parameter

Parameters:

* q - Search query (country name)
* language - "en" (English only)
* pageSize - 5 (number of articles)
* apiKey - Your API key

Data Extracted:

* articles[].title - Headline title
* articles[].urlToImage - Article image
* articles[].description - Short description
* articles[].url - Full article URL

Implementation Location: server.js (lines 81-102)

## License

This project is created for educational purposes as part of an academic assignment.

## Author

Created as Assignment 2: API Integration Project

## Acknowledgments

* RandomUser.me - Free random user data
* Countrylayer - Country information API
* ExchangeRate-API - Currency conversion data
* News API - News headlines and articles

---

Note: This application is designed for educational purposes and uses free-tier API keys with rate limits. For production use, consider upgrading to paid API plans.

```
```
