var searchBtn = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");
var searchHistory = document.getElementById("search-history");
var display = document.querySelector(".main-container")
var tourCountry = document.querySelector("#selectCountry")


var newsArticleEL = document.querySelector("#news-articles")
//maps.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

function getAddressInfo() {

    var place = autocomplete.getPlace();
    console.log(place)
    for (i = 0; i < place.address_components.length; i++) {
        var addressType = component.types[0];
        console.log(addressType)
        // if (componentForm[addressType]) {
        //   const val = component[componentForm[addressType]];
        //   document.getElementById(addressType).value = val;
        // }
    }
}

//Pull any metadata from google places API
var getCityName = function(){
    var cityItem = localStorage.getItem('currentCity')
    return cityItem;
}
var getStateLong = function(){
    var stateItem = localStorage.getItem('currentStateLong')
    return stateItem;
}
var getStateShort = function(){
    var stateItem = localStorage.getItem('currentStateShort')
    return stateItem;
}
var getCountryShort = function(){
    var countryItem = localStorage.getItem('currentCountryShort')
    return countryItem;
}
var getCountryLong = function(){
    var countryItem = localStorage.getItem('currentCountryLong')
    return countryItem;
}

// Search button function
var searchHandler = function (cityName) {
    cityName.preventDefault();
    $("#search-btn").classList = "button is-rounded is-info mt-3 hide"
    $("#search-btn").hide();
    var cityName = getCityName();
    var stateItem = getStateLong();
    var countryItem = getCountryLong();

    if (cityName) {
        $("#Main-container").removeClass("hide")
        getStateCovidInfo(stateItem)
        getCountryCovidInfo(countryItem)
        getTourismInfo(cityName)
        getWeatherInfo(cityName);
        getNewsInfo(cityName);
        cityHistory(cityName);
        searchInput.value = "";
        var capitalizeList = document.querySelector("#search-history")
        capitalizeList.classList.add("capitalize")

    } else if (currentStateShort === null || currentStateLong === null) {
        $("#state").addClass("hide")
    }
    else {
        swal("You entered an invalid city name!", "Please enter a valid one");
    }
};

// Tourism Info
var getTourismInfo = function (searchInput) {
    var accountParams = "&account=2321I3JB&token=m2u8msmg3otg23mkbqlxtkex4pjpzw58"
    var shortState = getStateShort();
    var shortCountry = getCountryShort();
    //debugger
    if (shortState === "Null") {
        var searchParams = "countrycode=" + shortCountry + "&tag_labels=city&annotate=trigram:" + searchInput + "&trigram=>=0.3"
    } else {
        var searchParams = "us_statecode=" + shortState + "&tag_labels=city&annotate=trigram:" + searchInput + "&trigram=>=0.3"
    }




    var tourismApi = "https://www.triposo.com/api/20200803/location.json?" + searchParams + accountParams;

    fetch(tourismApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayTourismInfo(data);
                    
                   
                    //var imageCount = data.results[0].images.length
                    //console.log(imageCount)
                })
            }
        })

}

var displayTourismInfo = function (data) {
    console.log(data)
    //debugger
    //console.log(data.results[0].images[9].source_url)
    var cityImageSrc = data.results[0].images[0].source_url
    var cityImageDisplay = `<img src="${cityImageSrc}" class="radius"/>`
    var cityImageEl = document.querySelector('#city-display')
    var cityTitle = document.querySelector('#city-title')
    var stateSubtitle = document.querySelector('#state-subtitle')
    var snippetEl = document.querySelector('#city-snippet')
    var tourismPlaceName = data.results[0].name

    var LongState = getStateLong();
    var longCountry = getCountryLong();

    cityImageEl.innerHTML = cityImageDisplay
    cityTitle.textContent = tourismPlaceName

    if (LongState === "Null") {
        stateSubtitle.textContent = longCountry
    } else {
        stateSubtitle.textContent = LongState
    }

    snippetEl.textContent = data.results[0].snippet

    // save data as array in local storage
    if(localStorage.getItem('tourismPlaceImg') == null){
        localStorage.setItem('tourismPlaceImg', '[]')
    }
    if(localStorage.getItem('tourismPlaceName') == null) {
        localStorage.setItem('tourismPlaceName', '[]')
    }
    var oldImg = JSON.parse(localStorage.getItem('tourismPlaceImg'))
    var oldName = JSON.parse(localStorage.getItem('tourismPlaceName'))
    
    oldImg.push(cityImageSrc)
    oldName.push(tourismPlaceName)

    var JSONplaceImg = JSON.stringify(oldImg)
    var JSONplaceName = JSON.stringify(oldName)
    
    localStorage.setItem('tourismPlaceImg', JSONplaceImg);
    localStorage.setItem('tourismPlaceName', JSONplaceName);
}

// COVID-19 Info
var getStateCovidInfo = function (stateItem) {
    fetch("https://coronavirus-us-api.herokuapp.com/api/state/all")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayStateCovidInfo(data, stateItem)
                })
            }
        })
}
var displayStateCovidInfo = function (data, stateItem) {
    var stateData = data.locations.find((location) => location.id.includes(stateItem))
    var date_updated = stateData.last_updated // already a string by the looks of it
    var latestConfirmed = stateData.latest.confirmed // confirmed number
    // var latestDeaths = stateItem.latest.deaths // deaths number
    // var totalStateCase = data.locations[StateIndex].latest.confirmed
    var stateInfo = document.getElementById("state")
    stateInfo.innerHTML = "Total Cases in " + stateItem + ": " + latestConfirmed
}
var getCountryCovidInfo = function (countryItem) {
    fetch("https://api.covid19api.com/summary")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayCountryCovidInfo(data, countryItem)
                })
            }
        })
}
var displayCountryCovidInfo = function (data, countryItem) {
    var countryData = data.Countries.find((location) => location.Country.includes(countryItem))
    var date_updated = countryData.last_updated // already a string by the looks of it
    var newConfirmed = countryData.NewConfirmed // confirmed number
    var totalConfirmed = countryData.TotalConfirmed

    var countryInfo = document.getElementById("country")
    var newCases = document.getElementById("new-cases")
    countryInfo.innerHTML = "Total Cases in " + countryItem + ": " + totalConfirmed
    newCases.innerHTML = "New Cases in " + countryItem + ": " + newConfirmed
}

// Weather function
var getWeatherInfo = function (cityName) {

    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=f28282748979d8ef4250a43282c46535";

    fetch(weatherApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data)
                    // cityHistory(cityName);
                })
            } else {
                swal("You entered an invalid city name!", "Please enter a valid one");
            }
        })
}

// Display weather
var displayWeather = function (data) {
    var currentTemp = data.main.temp;
    console.log(currentTemp)
    var currentHumid = data.main.humidity;
    console.log(currentHumid)
    var currentWind = data.wind.speed;
    console.log(currentWind)

    var currentDate = moment().format("M/D/YYYY")
    console.log(currentDate)

    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />"
    console.log(iconDisplay)

    var weatherTitle = document.getElementById("weather-title")
    var tempToday = document.querySelector("#temp-today")
    var humidToday = document.querySelector("#humid-today")
    var windToday = document.querySelector("#wind-today")
    var iconToday = document.getElementById("icon-today")

    // shows current weather
    weatherTitle.innerHTML = "Current Weather"
    iconToday.innerHTML = iconDisplay;
    tempToday.innerHTML = "Temperature: " + currentTemp;
    humidToday.innerHTML = "Humidity: " + currentHumid;
    windToday.innerHTML = "Winds: " + currentWind;
}

// News Info
var getNewsInfo = function (searchInput) {
    var newsUrl = 'https://gnews.io/api/v4/search?q=' + searchInput + ' AND Covid&token=e2f1f4142d0ffc6cc609a9e2831ed7c8&lang=en'

    fetch(newsUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    //var imageCount = data.results[0].images.length
                    //console.log(imageCount)
                    displayNewsInfo(data);
                })
            }
        })

}

var displayNewsInfo = function (newsData) {
    var articles = newsData.articles.length

    console.log(articles)
    newsArticleEL.textContent = ""

    for (var i = 0; i < articles; i++) {

        var newsSource = newsData.articles[i].source.name
        console.log(newsSource)
        var newsDescription = newsData.articles[i].description
        console.log(newsDescription)
        var newsHeadline = newsData.articles[i].title
        console.log(newsHeadline)
        var imgSource = newsData.articles[i].image
        console.log(imgSource)
        var newsLink = newsData.articles[i].source.url

        var newsParentEL = document.createElement("article")
        newsParentEL.classList = "media"
        newsArticleEL.appendChild(newsParentEL)

        /////////////Media Left Image elements
        var mediaLeftEl = document.createElement("figure")
        mediaLeftEl.classList = "media-left"
        newsParentEL.appendChild(mediaLeftEl)

        var mediaImageContainerEl = document.createElement("p")
        mediaImageContainerEl.classList = "image is-128x128"
        mediaLeftEl.appendChild(mediaImageContainerEl)

        var NewsImg = document.createElement("img")
        NewsImg.setAttribute("src", imgSource)
        NewsImg.classList = "radius"
        mediaImageContainerEl.appendChild(NewsImg)
        /////////////////////////////////////////////

        ////////////Media content elements
        var newsContentEL = document.createElement("div")
        newsContentEL.classList = "media-content"
        newsParentEL.appendChild(newsContentEL)

        var mediaContentEl = document.createElement("div")
        mediaContentEl.classList = "content newsback"
        newsContentEL.appendChild(mediaContentEl)

        //////////P elements to mediacontentEL
        var newsPaperEL = document.createElement("p")
        newsPaperEL.classList = "title is-4"
        newsPaperEL.textContent = newsSource
        mediaContentEl.appendChild(newsPaperEL)

        var headLineEl = document.createElement("p")
        headLineEl.classList = "subtitle is-5"
        headLineEl.textContent = newsHeadline
        mediaContentEl.appendChild(headLineEl)

        var newsDescEl = document.createElement("p")
        newsDescEl.classList = "is-small"
        newsDescEl.textContent = newsDescription
        mediaContentEl.appendChild(newsDescEl)

        var newsLinkEl = document.createElement("a")
        newsLinkEl.setAttribute("href", newsLink)
        newsLinkEl.innerHTML = "Read More"
        mediaContentEl.appendChild(newsLinkEl)

    }

}


// Adding city search to history 
var cityHistory = function (city) {

    var historyEl = document.createElement('option');
    historyEl.setAttribute("value", city);
    historyEl.setAttribute("id", city)
    historyEl.textContent = city;
    historyEl.setAttribute("style", "cursor:pointer")
    historyEl.classList = "button is-rounded mt-3"
    searchHistory.prepend(historyEl);
    // localStorage.getItem('tourismPlaceImg')


    historyEl.onclick = clickCity;
}

// function to call back clickable cities from the history
var clickCity = function () {
    var cityName = this.id;
    getWeatherInfo(cityName);
    getTourismInfo(cityName);
    getNewsInfo(cityName);
    
    
}

searchBtn.addEventListener("click", searchHandler);
// searchInput.addEventListener("keyup", function (event) {
//     if (event.key === 13) {
//         searchHandler(cityName)
//     }
// });