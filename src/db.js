import { Entry } from './Entry.js'
import { Dexie } from 'dexie'

export const db = new Dexie("techExerciseDB")
db.version(1).stores({
	entries: "++id, value, time", // id = pk, value & time = properties
})



export async function loadEntriesDB() {
	const entriesArray = await db.entries.toArray()

	const entries = []
	for (const entry of entriesArray) {
		entries.push(new Entry(entry.value, entry.time, entry.id));
	}

	return entries;
}

export async function addEntryDB(entry) {
	if (entry.id != null) {
		return null;
	}

	return await db.entries.add({ value: entry.value, time: entry.time });
}

export async function updateEntryDB(entry) {

	await db.entries.update(entry.id, {
		value: entry.value,
		time: entry.time
	})

}

export async function deleteEntryDB(entry) {
	await db.entries.delete(entry.id);
}
