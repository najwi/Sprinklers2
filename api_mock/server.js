const http = require('http');

const sprinklers = [
	{ id: 'a1b2c3d4-0000-0000-0000-000000000001', name: 'Front lawn', pinNumber: 0 },
	{ id: 'a1b2c3d4-0000-0000-0000-000000000002', name: 'Back garden', pinNumber: 1 },
];

const profiles = [
	{
		id: 'b2c3d4e5-0000-0000-0000-000000000001',
		name: 'Summer schedule',
		isActive: true,
		rules: [
			{
				sprinklerId: 'a1b2c3d4-0000-0000-0000-000000000001',
				name: 'Morning run',
				isActive: true,
				startTime: 21600,
				endTime: 25200,
				manualStartTime: -1,
				manualDuration: 600,
				dayInterval: 1,
				dayIntervalOffset: 0,
			},
			{
				sprinklerId: 'a1b2c3d4-0000-0000-0000-000000000002',
				name: 'Evening run',
				isActive: true,
				startTime: 21600,
				endTime: 25200,
				manualStartTime: -1,
				manualDuration: 600,
				dayInterval: 2,
				dayIntervalOffset: 1,
			},
		],
	},
];

function secondsSinceMidnight() {
	const now = new Date();
	return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

const CORS_HEADERS = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function respond(res, status, body) {
	res.writeHead(status, CORS_HEADERS);
	res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
	const { pathname } = new URL(req.url, 'http://localhost');

	if (req.method === 'OPTIONS') {
		res.writeHead(200, CORS_HEADERS);
		res.end();
		return;
	}

	let body = '';
	req.on('data', (chunk) => (body += chunk));
	req.on('end', () => {
		if (pathname === '/sprinklers') {
			if (req.method === 'GET') return respond(res, 200, sprinklers);
			if (['POST', 'PUT', 'DELETE'].includes(req.method)) return respond(res, 200, {});
		}
		if (pathname === '/profiles') {
			if (req.method === 'GET') return respond(res, 200, profiles);
			if (['POST', 'PUT', 'DELETE'].includes(req.method)) return respond(res, 200, {});
		}
		if (pathname === '/time' && req.method === 'GET') {
			return respond(res, 200, secondsSinceMidnight());
		}
		respond(res, 404, {});
	});
});

server.listen(3000, () => console.log('Mock API listening on http://localhost:3000'));
