/*
  Please add all Javascript code to this file.
*/

/*
Psuedocode

function - populate feed with articles 

function - API call to NewsAPI

function - API call to The Guardian

function - API call to New York Times

function - populate and activate popup

On DOM ready - call default/first API feed & click handlers to articles

Design Note: 
  Call the API once and preloading all the popups associated with each of the articles behind-the-scenes (either in DOM or in an object) 
  OR call the API twice (first time for all the articles, second time to get the specific data to populate the popup the user clicked)
  In terms of speed and reducing number of API calls, I opted to preload all the popup data in the dataset field for future use.
*/

const NEWSAPI_API_KEY = "";
const GUARDIAN_API_KEY = "";
const NEWYORKTIMES_API_KEY = "";

//const NEWSAPI_API_URL = "";
//const GUARDIAN_API_URL = "";
//const NEWYORKTIMES_API_URL = "";

const $popup = $('#popUp');

// Clear all articles from page
function clearArticles() {
  $('#main').html('');
}

// Display an article with parameters passed in. Appends it to the end of article list.
function displayArticle(articleTitle, articleCategory, articleImage, articleDescription, articleURL) {

  let $articleList = $('#main');

  let articleTemplate = `
    <article class="article" data-article="${articleTitle}" data-description="${articleDescription}" data-url="${articleURL}">
      <section class="featuredImage">
        <img src="${articleImage}" alt="" />
      </section>
      <section class="articleContent">
          <a href="#"><h3>${articleTitle}</h3></a>
          <h6>${articleCategory}</h6>
      </section>
      <section class="impressions">
        
      </section>
      <div class="clearfix"></div>
    </article>
  `;

  $articleList.append(articleTemplate);

}

// Loads a popup with parameters and returns completed when ready
function loadPopup(articleTitle, articleDescription, articleURL, completed) {

  let $popupLocation = $('#popUp');

  let popupTemplate = `
    <a href="#" class="closePopUp">X</a>
      <div class="container">
        <h1>${articleTitle}</h1>
        <p>
          ${articleDescription}
        </p>
        <a href="${articleURL}" class="popUpAction" target="_blank">Read more from source</a>
      </div>
  `;

  $popupLocation.append(popupTemplate);

  $popup.fadeOut(function(){
    $popup.removeClass('hidden').removeClass('loader').fadeIn();
  });
  completed();
}

// Close popup
function closePopUp(){
  $popup.fadeOut(function(){
    $popup.addClass('hidden').addClass('loader').fadeIn();
  });  
} 

// Calls the NewsAPI API for articles which then calls displayArticle for every article found
function getArticlesNewsAPI() {
  let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_API_KEY}`;

  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(data){
      //console.log(data.articles[0].title);

      data.articles.forEach(function(article, index){
        console.log(article);
        
        let articleImage = article.urlToImage !== null ? article.urlToImage : 'images/news_icon.png';

        displayArticle(article.title, article.source.name, articleImage, article.description, article.url);
        //preloadPopups(article.title, article.description, article.url, index);
      });

  });
}

// Calls The Guardian API for articles which then calls displayArticle for every article found
function getArticleGuardianAPI() {
  let url = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}`;

  fetch(url)
    .then(function(response){
      return response.json();
    }).then(function(data){

      data.response.results.forEach(function(article){
        console.log(article);

        displayArticle(article.webTitle, article.sectionName, 'images/news_icon2.png', null, article.webUrl);

      });

    });

}

// Calls The New York Times API for articles which then calls displayArticle for every article found
function getArticleNewYorkTimesAPI() {
  let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NEWYORKTIMES_API_KEY}`;

  fetch(url)
    .then(function(response){
      return response.json();
    }).then(function(data){

      data.response.docs.forEach(function(article){
        console.log(article);

        displayArticle(article.headline.main, article.type_of_material, 'images/news_icon3.png', article.snippet, article.web_url);

      });
    });
}

// On Page Ready
$(document).ready(function(){

  // load default news feeds
  getArticleNewYorkTimesAPI();
  getArticleGuardianAPI();
  getArticlesNewsAPI();

  // load popup of article on click
  $('#main').on('click', 'article', function(){
    let articleTitle = this.dataset.article;
    let articleDescription = this.dataset.description !== 'null' ? this.dataset.description : '';
    let articleURL = this.dataset.url;

    //console.log("Article title:", articleTitle + " description:" + articleDescription + " URL:" + articleURL);

    // load popup, when loading complete, assign click handler to close button
    loadPopup(articleTitle, articleDescription, articleURL, function(){
      //console.log("Close Popup");
      $popup.on('click', '.closePopUp', function(e){
        e.preventDefault;
        console.log('Close Popup Clicked', $(this).parent());
        $(this).parent().addClass('hidden').addClass('loader').html('');
      });
    });

  
  });

  // Clicking on Logo calls all 3 feeds
  $('#logo-feedr').on('click', function(e){
    e.preventDefault();
    clearArticles();
    getArticleNewYorkTimesAPI();
    getArticleGuardianAPI();
    getArticlesNewsAPI();
    });

  // Navigation buttons call respective APIs
  $('.nav-button').on('click', function(e){
    e.preventDefault();
    if (this.id === 'nav-feed1') {
      clearArticles();
      getArticlesNewsAPI();
    } else if (this.id === 'nav-feed2') {
      clearArticles();
      getArticleGuardianAPI();
    } else if (this.id === 'nav-feed3') {
      clearArticles();
      getArticleNewYorkTimesAPI()
    } else {
      console.log("Invalid Navigation Choice");
    }
  });

  // Open Search Box when icon clicked
  $('#search a').on('click', function(e){
    e.preventDefault();
    $('#search').toggleClass('active');
  });

  // #TODO# Filter articles by user input 
  $('#searchText').on('keyup', function(){
    console.log($(this).val());

  });

});