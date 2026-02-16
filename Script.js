const cityInput = document.querySelector('.input-item')
const searchBtn = document.querySelector('.search-icon')


const weatherInfo = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const notCitySection = document.querySelector('.not-city')

const cityName = document.querySelector('.city-name')
const temText = document.querySelector('.tem-text')
const conditionWeather = document.querySelector('.condition-weather')
const humidityValueText = document.querySelector('.hum-count')
const speedKm = document.querySelector('.speed-km')
const timeDate = document.querySelector('.date-item')
const weatherImg = document.querySelector('.tem-img')
const foreCastContainer = document.querySelector('.forcast-container')





const apiKey = '1589c867bd3972e2e5424e0a425e91b4'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.toLowerCase().trim() != '') {
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.toLowerCase().trim() != '') {
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

const getFetchData = async (endPoint, city) => {
    try {
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
        const respons = await fetch(apiUrl)
        return respons.json()
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    }

}

const getWeatherIcon = (id) => {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

const getDate=()=>{
    const currentDate =new Date()
    const option = {
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',option)
}
const updateWeather = async (city) => {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        showSection(notFoundSection)
    }
    console.log(weatherData)
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    cityName.innerText = country
    temText.innerText = Math.round(temp) + ' °C'
    conditionWeather.innerText = main
    humidityValueText.innerText = humidity + ' %'
    speedKm.innerText = speed + ' M/s'
    timeDate.innerText = getDate()
    weatherImg.src = `assets/weather/${getWeatherIcon(id)}`


    await updateForcastInfo(city)
    showSection(weatherInfo)
}

const updateForcastInfo = async (city
) => {
    const foreCastData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const toDayDate = new Date().toISOString().split('T')[0]
    foreCastContainer.innerHTML = ''
    foreCastData.list.forEach(foreWeather => {
        if (foreWeather.dt_txt.includes(timeTaken) && !foreWeather.dt_txt.includes(toDayDate)) {

            updateForcastItem(foreWeather)
        }
    })

}

const updateForcastItem = (weatherData) => {
    const { dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken =new Date(date)
    const dateOption = {
        day:'2-digit',
        month:'short',

    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
    const foreCastItem = `
    <div class="forcast-child">
                    <h5> ${dateResult} </h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forcast-img">
                    <h5> ${Math.round(temp)} </h5>
                </div>
    `
    foreCastContainer.insertAdjacentHTML('beforeend',foreCastItem)
}

const showSection = (section) => {
    [weatherInfo, notCitySection, notFoundSection].forEach(section => section.style.display = 'none')

    section.style.display = 'flex'


}


