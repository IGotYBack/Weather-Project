console.log("konékté")

const submitBtn = document.querySelector('.submitBtn');
// console.log(submitBtn);
const cityFromUser = document.getElementById('cityFromUser');
// console.log(cityFromUser);
const weatherInDOM = document.querySelector('.weather')

let weatherByDay = [[], [], [], [], []]


// Change name to coordinates
async function coordinateWeather(cityChoosen) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityChoosen}&limit=5&appid=a5cf13039d6af02d4d2993ee2c8d7191`)

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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=a5cf13039d6af02d4d2993ee2c8d7191&units=metric&lang=fr`)

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

submitBtn.addEventListener('click', () => {
    cityChoosen = cityFromUser.value;
    // console.log(cityC/Zhoosen);

    addToDOM()

    coordinateWeather(cityChoosen).then(coordinatesOFCity => {

        // console.log(coordinatesOFCity)
        const lat = coordinatesOFCity[0];
        // console.log(lat);
        const long = coordinatesOFCity[1];
        // console.log(long);

        cityWeather(lat, long).then(cityWeather => {
            // console.log(cityWeather);
            // console.log(weatherByDay)
            weatherByDay.forEach(day => {
                addToDataCard(day[0])
            })
        })
    })



})

const addToDOM = () => {
    const divWeatherCard = document.createElement('div');

    const divCityImg = document.createElement('div');
    const cityName = document.createElement('h2');
    const divcityData = document.createElement('div');

    cityName.innerText = cityFromUser.value.toUpperCase()
    divCityImg.classList.add('imgOfCity', 'displayFlex', 'alignCenter', 'justifyCenter', 'width100')
    divWeatherCard.classList.add('displayFlexColumn', 'alignCenter', 'marginNormal')
    divcityData.classList.add('displayFlex', 'justifyEvenly', 'width100')
    divcityData.setAttribute('city', cityFromUser.value)


    weatherInDOM.append(divWeatherCard);
    divWeatherCard.append(divCityImg, divcityData);
    divCityImg.append(cityName);
}

const addToDataCard = (day) => {
    console.log(day)
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