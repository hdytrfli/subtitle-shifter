const Timestamp = {
	serialize(value: number) {
		if (value < 0) return '00:00:00,000';

		const hours = Math.floor(value / 3600000);
		const minutes = Math.floor((value % 3600000) / 60000);
		const seconds = Math.floor((value % 60000) / 1000);
		const ms = value % 1000;

		const result = [
			hours.toString().padStart(2, '0'),
			minutes.toString().padStart(2, '0'),
			seconds.toString().padStart(2, '0'),
		];

		return result.join(':') + ',' + ms.toString().padStart(3, '0');
	},

	deserialize(value: string) {
		const [timepart, mspart] = value.split(',');
		const [hours, minutes, seconds] = timepart.split(':').map(Number);
		const ms = Number.parseInt(mspart, 10);

		return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
	},
};

export default Timestamp;
