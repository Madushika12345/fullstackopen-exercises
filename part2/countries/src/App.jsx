import { useState, useEffect } from 'react'
import axios from 'axios'

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
  const filteredCountries = countries.filter(country =>
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
            {country.name.common}
          </p>
        ))
      )}
    </div>
  )
}

export default App