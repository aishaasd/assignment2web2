// Get DOM elements
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const contentContainer = document.getElementById('contentContainer');

// Event listener for generate button
generateBtn.addEventListener('click', generateRandomUser);

// Main function to fetch and display user data
async function generateRandomUser() {
  try {
    // Show loading, hide error and content
    showLoading();
    hideError();
    hideContent();

    // Fetch data from backend
    const response = await fetch('/api/random-user');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch data');
    }

    // Display all data
    displayUserProfile(data.user);
    displayCountryInfo(data.country);
    displayExchangeRates(data.exchangeRates);
    displayNews(data.news);

    // Show content and hide loading
    hideLoading();
    showContent();

  } catch (error) {
    console.error('Error:', error);
    hideLoading();
    showError(error.message || 'An error occurred. Please try again.');
  }
}

// Display user profile information
function displayUserProfile(user) {
  document.getElementById('profilePicture').src = user.profilePicture;
  document.getElementById('fullName').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('gender').textContent = capitalizeFirst(user.gender);
  document.getElementById('age').textContent = user.age;
  document.getElementById('dob').textContent = user.dateOfBirth;
  document.getElementById('city').textContent = user.city;
  document.getElementById('country').textContent = user.country;
  document.getElementById('address').textContent = user.fullAddress;
}

// Display country information
function displayCountryInfo(country) {
  const countryFlag = document.getElementById('countryFlag');
  
  if (country.flag) {
    countryFlag.src = country.flag;
    countryFlag.style.display = 'block';
  } else {
    countryFlag.style.display = 'none';
  }

  document.getElementById('countryName').textContent = country.countryName;
  document.getElementById('capital').textContent = country.capital;
  document.getElementById('languages').textContent = country.languages;
  document.getElementById('currency').textContent = country.currency || 'N/A';
}

// Display exchange rates
function displayExchangeRates(rates) {
  const exchangeSection = document.getElementById('exchangeRatesSection');
  
  if (rates && rates.baseCurrency) {
    exchangeSection.style.display = 'block';
    
    const usdRate = typeof rates.usd === 'number' ? rates.usd.toFixed(2) : rates.usd;
    const kztRate = typeof rates.kzt === 'number' ? rates.kzt.toFixed(2) : rates.kzt;
    
    document.getElementById('rateUSD').textContent = 
      `1 ${rates.baseCurrency} = ${usdRate} USD`;
    document.getElementById('rateKZT').textContent = 
      `1 ${rates.baseCurrency} = ${kztRate} KZT`;
  } else {
    exchangeSection.style.display = 'none';
  }
}

// Display news articles
function displayNews(newsArticles) {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '';

  if (!newsArticles || newsArticles.length === 0) {
    newsContainer.innerHTML = '<p style="text-align: center; color: #666;">No news articles available.</p>';
    return;
  }

  newsArticles.forEach(article => {
    const newsCard = createNewsCard(article);
    newsContainer.appendChild(newsCard);
  });
}

// Create a news card element
function createNewsCard(article) {
  const card = document.createElement('div');
  card.className = 'news-card';

  // Image section
  const imageSection = article.image 
    ? `<img src="${article.image}" alt="News Image" class="news-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
       <div class="news-image-placeholder" style="display: none;">No Image</div>`
    : `<div class="news-image-placeholder">No Image</div>`;

  card.innerHTML = `
    ${imageSection}
    <div class="news-content">
      <h3 class="news-title">${escapeHtml(article.title)}</h3>
      <p class="news-description">${escapeHtml(article.description)}</p>
      <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="news-link">
        Read Full Article →
      </a>
    </div>
  `;

  return card;
}

// Utility functions
function showLoading() {
  loading.style.display = 'block';
}

function hideLoading() {
  loading.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function hideError() {
  errorMessage.style.display = 'none';
}

function showContent() {
  contentContainer.style.display = 'block';
}

function hideContent() {
  contentContainer.style.display = 'none';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}