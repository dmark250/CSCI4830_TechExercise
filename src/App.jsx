import { useState, useEffect, useRef } from 'react'
import './App.css'
import { loadEntriesDB, addEntryDB, updateEntryDB, deleteEntryDB } from './db.js'
import { Entry } from './Entry.js'

function App() {
  const [entries, setEntries] = useState([]);
  const [areYouSure, setAreYouSure] = useState([false]);
  const newData = useRef(false);
  const sure = useRef(false);
  const removedEntries = useRef([]);

  useEffect(() => {
    async function loadInitialEntries() {
      setEntries(await loadEntriesDB());
    }

    loadInitialEntries();
  }, []);

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
    <div>
      <div>
        <h1>CSCI4830_TechExercise</h1>
        <h2>Devin Mark</h2>
      </div>

      {areYouSure[0] ? (
        <div className='are-you-sure' >
          <h3>Are you sure?</h3>
          <button onClick={areYouSureYes}>Yes!</button>
          <button onClick={areYouSureNo}>No!</button>
        </div>
      ) : null}

      <div className='entries-options'>
        <button onClick={addEntry}>Add Entry</button>
        <button onClick={clearData}>Clear Entries</button>
        <button onClick={loadData}>Load Entries</button>
        <button onClick={saveData}>Save Entries</button>
      </div>

      <div className='user-entries'>
        {/* TODO: Add rendering for entries with buttons on each for changing the value. Should use the index in entries to change that one. Use editEntry() somehow? */}
        {/* Also maybe a delete button on each one as well that would use removeEntry? */}
      </div>

    </div>
  )
}

export default App
