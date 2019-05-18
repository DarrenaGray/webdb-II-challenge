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

server.get('/api/zoos/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.first()
		.then(zoo => {
			if (zoo) {
				res.status(200).json(zoo);
			} else {
				res.status(404).json({ message: 'The zoo with the specified ID could not be found.' });
			}
		})
		.catch(err => {
			res.status(500).json(err);
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

server.put('/api/zoos/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.update(req.body)
		.then(updatedZoo => {
			if (updatedZoo) {
				res.status(200).json({ message: 'Zoo info was successfully updated.' });
			} else {
				res.status(404).json({ message: 'The zoo with the specified ID could not be found.' });
			}
		})
		.catch(err => {
			res.status(500).json({ err, message: 'The zoo info could not be updated.' });
		});
});

server.delete('/api/zoos/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.delete()
		.then(deletedZoo => {
			if (deletedZoo) {
				res.status(200).json({ message: 'The zoo was successfully deleted.' });
			} else {
				res.status(404).json({ message: 'The zoo with the specified ID could not be found.' });
			}
		})
		.catch(err => {
			res.status(500).json({ err, message: 'The info could not be deleted' });
		});
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
