const pace_types = {
	'Maraton': 42.195,
	'Half-Marathon': 21.0975,
	'10K': 10,
	'5K': 5,
	'1K': 1,
	'1 Mile': 1.609344,
	'5 Miles': 8.04672,
	'10 Miles': 16.0934,
	'800 Meters': 0.8,
	'1500 Meters': 1.5,
}

function calculate() {
	const time_pace = input.get('time_pace').raw();
	const distance_pace = input.get('distance_pace').optional().positive().raw();
	const pace_type = input.get('pace_type').raw();

	if (!input.valid()) return;

	if (!time_pace) {
		input.exception('time_pace', 'Polje je obavezno');
		return;
	}

	const distance = distance_pace;
	const time = getTime(time_pace);
	const {
		perKilometer, kilometersPerHour,
		metersPerMinute, metersPerSecond
	} = calculateSpeedMetrics(time, distance);

	const results = [
		`${perKilometer} po km`,
		`${kilometersPerHour} km/h`,
		`${metersPerMinute} m/min`,
		`${metersPerSecond} m/s`, 
	];

	const typeResults = [];
	//Calculate popular distances
	Object.keys(pace_types).forEach(key => {
		const typeDistance = pace_types[key];
		const {perKilometerRaw} = calculateSpeedMetrics(time, distance);
		typeResults.push(`${key}: ${secondsToHMS(perKilometerRaw * typeDistance)}`);
	});

	_('result_0').innerHTML = getResult(results, typeResults);
}

function getResult(result1, result2) {
	let html = '';
	result1.forEach(r => {
		html += `<tr><td colspan="2" class="animate">${r}</td></tr>`
	})
	return html;
}

function getTime(value) {
	let time = 0;
	const times = value.split(':');

	const hours = parseInt(times[0]);
	if (hours) time += hours * 3600;

	const minutes = parseInt(times[1]);
	if (minutes) time += minutes * 60;

	const seconds = parseInt(times[2]);
	if (seconds) time += seconds;

	return time;
}

function secondsToHMS(seconds) {
	if (seconds < 0) {
		return "Nesipravan unos"; // Handle negative input if needed
	}

	const hours = roundTo(Math.floor(seconds / 3600), 0);
	const remainingSeconds = seconds % 3600;
	const minutes = roundTo(Math.floor(remainingSeconds / 60), 0);
	const sec = +(remainingSeconds % 60).toFixed(0);
	let result = "";

	if (hours > 0) {
		result = `${hours}h${minutes ? ` ${minutes}min` : ''}${sec ? ` ${sec}s` : ''}`;
	} else if (minutes > 0) {
		result = `${minutes}min${sec ? ` ${sec}s` : ''}`;
	} else if (sec > 0) {
		result = `${sec}s`;
	} else {
		result = '0s';
	}

	return result.trim();
}

function calculateSpeedMetrics(timeInSeconds, distanceInKilometers) {

	// Calculate speed metrics
	const perKilometerRaw = timeInSeconds / distanceInKilometers;
	const perKilometer = secondsToHMS(timeInSeconds / distanceInKilometers);
	
	const kilometersPerHour = roundTo(distanceInKilometers / (timeInSeconds / 3600), 3);
	const metersPerMinute = roundTo((distanceInKilometers * 1000) / (timeInSeconds / 60), 3);
	const metersPerSecond = roundTo((distanceInKilometers * 1000) / timeInSeconds, 3);

	return {
		perKilometerRaw,
		perKilometer,
		kilometersPerHour,
		metersPerMinute,
		metersPerSecond,
	};
}

/*TIME*/
function calculateTime() {
	const distance = input.get('distance_time').positive().val();
	const time_pace = input.get('pace_time').raw();

	if (!input.valid()) return;

	if (!time_pace) {
		input.exception('time_pace', 'Polje je obavezno');
		return;
	}

	const results = [];

	const time = getTime(time_pace);
	const timeToGo = 'Potrebno vrijeme ' + secondsToHMS(time * distance);
	results.push(timeToGo);

	const typeResults = [];
	//Calculate popular distances
	Object.keys(pace_types).forEach(key => {
		const distance = pace_types[key];
		typeResults.push(`${key}: ${secondsToHMS(time * distance)}`);
	});

	_('result_1').innerHTML = getResult(results, typeResults);
}

function calculateDistance() {
	const time_distance = input.get('time_distance').raw();
	const pace_distance = input.get('pace_distance').raw();

	if (!input.valid()) return;

	if (!time_distance) {
		input.exception('time_distance', 'Polje je obavezno');
		return;
	}

	if (!pace_distance) {
		input.exception('pace_distance', 'Polje je obavezno');
		return;
	}

	const time = getTime(time_distance);
	const pace = getTime(pace_distance);

	const distance = calculateDistanceMetrics(time, pace);

	const results = [
		`${distance.kilometers} km`,
		`${distance.meters} m`,
	];

	const typeResults = [];
	//Calculate popular distances
	Object.keys(pace_types).forEach(key => {
		const distance = pace_types[key];
		typeResults.push(`${key} at ${secondsToHMS(distance * pace)}`);
	});

	_('result_2').innerHTML = getResult(results, typeResults);
}

function calculateDistanceMetrics(timeInSeconds, pacePerKilometer) {
	if (timeInSeconds <= 0 || pacePerKilometer <= 0) {
		return "Neispravan unos, vrijeme i tempo moraju biti pozitivni brojevi.";
	}

	// Calculate distance in kilometers
	const distanceInKilometers = timeInSeconds / pacePerKilometer;

	// Convert distance to miles
	const distanceInMiles = distanceInKilometers * 0.621371;

	// Convert distance to meters
	const distanceInMeters = distanceInKilometers * 1000;

	// Convert distance to yards
	const distanceInYards = distanceInMeters * 1.09361;

	return {
		miles: roundTo(distanceInMiles, 2),
		kilometers: roundTo(distanceInKilometers, 2),
		meters: roundTo(distanceInMeters, 2),
		yards: roundTo(distanceInYards, 2),
	};
}

function changeDistance(el){
	const value = el.value;
	if(!value) return;
	document.getElementById('distance_pace').value = pace_types[value];
	document.getElementById('distance_pace_imperial').value = roundTo(pace_types[value] / 1.609344, 3);
}