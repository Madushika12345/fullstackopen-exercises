
import { useState, useEffect } from 'react'
import personService from './services/persons'
const Filter = ({ newFilter, setNewFilter }) => {
  return (
    <div>
      filter shown with: <input
        value={newFilter}
        onChange={(event) => setNewFilter(event.target.value)}
      />
    </div>
  )
}
const PersonForm = ({
  addPerson,
  newName,
  setNewName,
  newNumber,
  setNewNumber
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>

      <div>
        number: <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <p key={person.id}>
          {person.name}: {person.number}
        </p>
      ))}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])

const [newName, setNewName] = useState('')
const [newNumber, setNewNumber] = useState('')
const [newFilter, setNewFilter] = useState('')
useEffect(() => {
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
}, [])

const addPerson = (event) => {
  event.preventDefault()

  const nameExists = persons.some(
    person => person.name === newName
  )

  if (nameExists) {
    alert(`${newName} is already added to phonebook`)
    return
  }

  const personObject = {
    name: newName,
    number: newNumber
  }

  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
}
const personsToShow = persons.filter(person =>
  person.name.toLowerCase().includes(newFilter.toLowerCase())
)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
      
    </div>
  )
}

export default App
