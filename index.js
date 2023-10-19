const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
// Accessing static files from a "views" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/home.html');
});

// to use encrypted data
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	const ip = req.ip;
	const date = new Date().toUTCString();
	const userAgent = req.get('User-Agent');
	const logEntry = `IP: ${ip}, Date: ${date}, User-Agent: ${userAgent}\n`;

	// Write log entry to a file (append mode)
	fs.appendFile('access.log', logEntry, (err) => {
		if (err) {
			console.error('Error writing to the log file');
		}
	});

	next(); // Continue processing the request
});
// Defining a route to render an EJS template
app.get('/', (req, res) => {
	res.render('home');
});

app.listen(port, () => {
	console.log(`Your app is running on port ${port}`);
});
