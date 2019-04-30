const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
	client: 'sqlite3',
	connection: {
		filename: './data/lambda.sqlite3',
	},
	useNullAsDefault: true,
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
	res.send('Connected');
});

// endpoints here

server.get('/api/zoos', (req, res) => {
	db('zoos')
		.then(zoos => {
			res.status(200).json(zoos);
		})
		.catch(err => {
			console.log(err);
		});
});

server.post('/api/zoos', (req, res) => {
	// INSERT INTO
	db('zoos')
		.insert(req.body, 'id')
		.then(zoo => {
			res.status(200).json(zoo);
		})
		.catch(err => {
			res.status(500).json({
				err,
				message: 'There was an error while saving the zoo to the database.',
			});
		});
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
