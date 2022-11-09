// console.log("konékté")

const submitBtn = document.querySelector('.submitBtn');
const clearBtn = document.querySelector('.clearBtn');
const compareBtn = document.querySelector('.compareBtn');
// console.log(submitBtn);
const cityFromUser = document.getElementById('cityFromUser');
// console.log(cityFromUser);
const weatherInDOM = document.querySelector('.weather');
let weatherByDay = [[], [], [], [], []];
let APIWeatherKey;
let APIImgKey;

fetch('./assets/file/keyWeather.txt')
    .then(resp => {
        // console.log(resp);
        if (resp.status === 404) throw new Error('File ./assets/file/keyWeather.txt does not exists.');
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.text();
    })
    .then(key => {
        APIWeatherKey = key;
    })
    .catch(error => {
        console.error(error.message)
    })

// fetch('./assets/file/keyImg.txt')
//     .then(resp => {
//         // console.log(resp);
//         if (resp.status === 404) throw new Error('File ./assets/file/keyImg.txt does not exists.');
//         if (!resp.ok) throw new Error(resp.statusText);
//         return resp.text();
//     })
//     .then(key => {
//         APIImgKey = key;
//     })
//     .catch(error => {
//         console.error(error.message)
//     })


const addToDOM = (urlImg) => {
    // console.log(urlImg)
    const divWeatherCard = document.createElement('div');

    const divCityImg = document.createElement('div');
    const cityName = document.createElement('h2');
    const divcityData = document.createElement('div');

    cityName.innerText = cityFromUser.value.toUpperCase()
    divCityImg.classList.add('imgOfCity', 'displayFlex', 'alignCenter', 'justifyCenter', 'width100')
    divWeatherCard.classList.add('displayFlexColumn', 'alignCenter', 'marginNormal')
    divcityData.classList.add('displayFlex', 'justifyEvenly', 'width100', 'weatherCard')
    divcityData.setAttribute('city', cityFromUser.value)
    cityName.classList.add('cityName')
    divCityImg.style.backgroundImage = `url(${urlImg})`

    divWeatherCard.setAttribute('city', 'weatherCard')



    weatherInDOM.append(divWeatherCard);
    divWeatherCard.append(divCityImg, divcityData);
    divCityImg.append(cityName);
}

const addToDataCard = (day) => {
    // console.log(day)
    // console.log(day.weather[0].description)
    const divcityData = document.querySelector(`[city=${cityFromUser.value}]`)
    // console.log(divcityData)
    const divDatasCard = document.createElement('div');//div data
    const dayTitle = document.createElement('h2')//jour en question

    const descriptionDiv = document.createElement('div');
    const weatherDescription = document.createElement('h3');
    const descriptionInfos = document.createElement('p');

    const tempDiv = document.createElement('div');
    const weatherTemp = document.createElement('h3');
    const tempInfos = document.createElement('p');

    const humidityDiv = document.createElement('div');
    const weatherHumidity = document.createElement('h3');
    const humidityInfos = document.createElement('p');

    let dayOfWeek = new Date(day.dt_txt)
    let optionsDay = { weekday: 'long' }
    const dayNowInLetter = Intl.DateTimeFormat('fr-BE', optionsDay).format(dayOfWeek);

    dayTitle.innerText = dayNowInLetter.toUpperCase()
    weatherDescription.innerText = 'Weather';
    descriptionInfos.innerText = day.weather[0].description;
    weatherTemp.innerText = 'Temperature';
    tempInfos.innerText = `${day.main.temp}°C`;
    weatherHumidity.innerText = 'Humidity';
    humidityInfos.innerText = `${day.main.humidity}%`;

    divcityData.append(divDatasCard);
    divDatasCard.append(dayTitle, descriptionDiv, tempDiv, humidityDiv);

    descriptionDiv.append(weatherDescription, descriptionInfos);
    tempDiv.append(weatherTemp, tempInfos);
    humidityDiv.append(weatherHumidity, humidityInfos)
}
// Change name to coordinates
async function coordinateWeather(cityChoosen) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityChoosen}&limit=5&appid=${APIWeatherKey}`)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const city = await response.json();
    // console.log(city);
    const coordinatesOFCity = [city[0].lat, city[0].lon]
    return coordinatesOFCity;
}

async function cityWeather(lat, long) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${APIWeatherKey}&units=metric&lang=fr`)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const getTheWeather = await response.json();
    // console.log(getTheWeather)
    weatherByDay = [[], [], [], [], []]
    let i = 0
    let c = 0
    getTheWeather.list.forEach((weatherEntry) => {
        if (i < 8) {
            weatherByDay[c].push(weatherEntry)
        } else {
            c++
            weatherByDay[c].push(weatherEntry)
            i = 0
        }

        i++
    })
    // console.log(weatherByDay)
    return getTheWeather
}

async function getImgOfCity() {
    const cityChoosen = cityFromUser.value;

    const response = await fetch(`https://api.unsplash.com/search/photos?&query=city=${cityChoosen}&orientation=landscape&client_id=cU9uyfk_4ixIaQ__GoBXT-8yaIL323kkS8VoeEZSuko`)
    // console.log(response)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const imgFromUnsplash = await response.json();
    // console.log(imgFromUnsplash);
    const urlImg = imgFromUnsplash.results[0].urls.regular;
    // console.log(urlImg)
    return urlImg
}

submitBtn.addEventListener('click', () => {
    const cityChoosen = cityFromUser.value;
    // console.log(cityC/Zhoosen);
    // weatherInDOM.innerHTML = ""
    getImgOfCity(cityChoosen).then(urlImg => {
        addToDOM(urlImg)

        coordinateWeather(cityChoosen).then(coordinatesOFCity => {
            const lat = coordinatesOFCity[0];
            const long = coordinatesOFCity[1];

            cityWeather(lat, long).then(cityWeather => {
                weatherByDay.forEach(day => {
                    addToDataCard(day[0])
                })
            })
        })
    })
})


let weatherToCompare = []

clearBtn.addEventListener('click', () => {
    weatherInDOM.innerHTML = ''
})

// compareBtn.addEventListener('click', () => {
    // // console.log('cékliké')
    // const retrieveCityData = document.querySelectorAll(`[city=weatherCard]`)
    // // console.log(retrieveCityData)
    // citiesToCompare = []

    // retrieveCityData.forEach(city => {
    //     citiesToCompare.push(city)
    // });
    // console.log(citiesToCompare)


//     coordinateWeather(cityChoosen).then(coordinatesOFCity => {
//         const lat = coordinatesOFCity[0];
//         const long = coordinatesOFCity[1];

//         cityWeather(lat, long).then(cityWeather => {
//             console.log(cityWeather)
//         })
//     })
// })

