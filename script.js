console.log("konékté")

const submitBtn = document.querySelector('.submitBtn');
// console.log(submitBtn);
const cityFromUser = document.getElementById('cityFromUser');
// console.log(cityFromUser);

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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=a5cf13039d6af02d4d2993ee2c8d7191&units=metric&lang=fr`)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const getTheWeather = await response.json();
    console.log(getTheWeather)
}

submitBtn.addEventListener('click', () => {
    cityChoosen = cityFromUser.value
    console.log(cityChoosen)

    coordinateWeather(cityChoosen).then(coordinatesOFCity => {

        // console.log(coordinatesOFCity)
        const lat = coordinatesOFCity[0]
        // console.log(lat)
        const long = coordinatesOFCity[1]
        // console.log(long)

        cityWeather(lat, long)
    })

    console.log("Bonjour je suis fait direck'")
})

