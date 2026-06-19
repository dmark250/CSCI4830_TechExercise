import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {loadEntries} from './db.js'

function App() {
  const [entries, setEntries] = useState(loadEntries())

  function clearData() {
    
  }

  function loadData() {

  }

  function addEntry() {

  }

  

  return (
    <div>
        <div>
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

      <div>
        <button onClick={addEntry}>Add Entry</button>
      </div>

      

      <div className="ticks"></div>
    </div>
  )
}

export default App
