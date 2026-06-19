export class Entry {
	constructor(value, time = Date.now(), id =  null) {
		this.value = value;
		this.time = time;
		this.id = id;
	}

	getValue() {
		return this.value;
	}

	getTime() {
		return this.time;
	}

	setValue(value) {
		this.value = value;
	}

	setId(id) {
		this.id = id;
	}

	setTime(time) {
		this.time = time;
	}

	getId() {
		return this.id;
	}
}
