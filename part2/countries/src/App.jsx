import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const capital = country.capital?.[0]

    if (!capital) {
      return
    }

    setWeather(null)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: `${capital},${country.cca2}`,
          appid: apiKey,
          units: 'metric'
        }
      })
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Weather request failed:', error.response?.status)
      })
  }, [country])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>

      <p>Temperature: {weather.main.temp} °C</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />

      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}
const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {country.capital?.join(', ')}</p>
      <p>Area: {country.area} km²</p>

      <h3>Languages</h3>

      <ul>
        {Object.values(country.languages || {}).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      <Weather key={country.name.common} country={country} />
    </div>
  )
}
const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  const exactMatch = countries.find(country =>
    country.name.common.toLowerCase() === search.toLowerCase()
  )

  const filteredCountries = exactMatch
    ? [exactMatch]
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )

  return (
    <div>
      find countries: <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : (
        filteredCountries.map(country => (
          <p key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => setSearch(country.name.common)}>
              show
            </button>
          </p>
        ))
      )}
    </div>
  )
}

export default App