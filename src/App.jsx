import { useState, useEffect, useRef } from 'react'
import './App.css'
import { loadEntriesDB, addEntryDB, updateEntryDB, deleteEntryDB } from './db.js'
import { Entry } from './Entry.js'

function App() {
  const [entries, setEntries] = useState([]);
  const [areYouSure, setAreYouSure] = useState([false]);
  const newData = useRef(true);
  const sure = useRef(false);
  const removedEntries = useRef([]);

  async function areYouSureYes() {
    const callback = areYouSure[1];
    setAreYouSure([false]);
    sure.current = true;
    await callback();
  }

  function areYouSureNo() {
    setAreYouSure([false]);
  }

  function clearData() {
    if (sure.current === false) {
      setAreYouSure([true, clearData]);
      return;
    }
    sure.current = false;
    newData.current = true;
    removedEntries.current.push(
      ...entries.filter((entry) => entry.id !== null)
    );
    setEntries([]);
  }

  function addEntry() {
    const newEntry = new Entry("New Entry");
    newData.current = true;
    setEntries((entries) => [newEntry, ...entries]);
  }

  async function loadData() {
    if (newData.current === false) {
      return;
    }
    if (sure.current === false) {
      setAreYouSure([true, loadData]);
      return;
    }
    newData.current = false;
    sure.current = false;
    removedEntries.current = [];
    setEntries(await loadEntriesDB());
  }

  async function saveData() {
    if (newData.current === false) {
      return;
    }
    if (sure.current === false) {
      setAreYouSure([true, saveData]);
      return;
    }
    sure.current = false;
    for (const entry of entries) {
      if (entry.id === null) {
        entry.id = await addEntryDB(entry);
        continue;
      }
      await updateEntryDB(entry);
    }
    for (const entry of removedEntries.current) {
      await deleteEntryDB(entry);
    }
    removedEntries.current = [];
    newData.current = false;
  }

  function editEntry(index, value) {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      value: value
    };
    newData.current = true;
    setEntries(newEntries)
  }

  function removeEntry(index) {
    const newEntries = [...entries];
    const [removedEntry] = newEntries.splice(index, 1);
    newData.current = true;
    setEntries(newEntries)
    if (removedEntry.id === null) {
      return;
    }
    removedEntries.current.push(removedEntry);
  }

  return (
    <div className='app'>
      <div className='app-header'>
        <a className='app-title' href='https://github.com/dmark250/CSCI4830_TechExercise'>CSCI4830_TechExercise</a>
        <a className='app-author' href='https://github.com/dmark250'>Devin Mark</a>

      </div>

      {areYouSure[0] ? (
        <div className='are-you-sure' >
          <h3 className='are-you-sure-title'>Are you sure?</h3>
          <button className='are-you-sure-yes' onClick={areYouSureYes} >Yes!</button>
          <button className='are-you-sure-no' onClick={areYouSureNo} >No!</button>
        </div>
      ) : null}

      <div className='entries-options'>
        <button className='add-entry-button' onClick={addEntry} >Add Entry</button>
        <button className='clear-entries-button' onClick={clearData} >Clear Entries</button>
        <button className='load-entries-button' onClick={loadData} >Load Entries</button>
        <button className='save-entries-button' onClick={saveData} >Save Entries</button>
      </div>

      <div className='user-entries'>
        {entries.map((entry, index) => (
          <div className='user-entry' key={entry.id ?? entry.time}>
            <input className='entry-value' type='text' value={entry.value} onChange={(event) => editEntry(index, event.target.value)} />
            <button className='remove-entry-button' onClick={() => removeEntry(index)} >Remove</button>
          </div>
        ))}
      </div>

    </div>

  )
}

export default App
