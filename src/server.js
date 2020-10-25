import sirv from 'sirv';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV, SSL_KEY, SSL_CERT } = process.env;
const dev = NODE_ENV === 'development';
const PORT_HTTP = 8080;

const app = express();

const options = {
	key: fs.readFileSync(SSL_KEY),
	cert: fs.readFileSync(SSL_CERT)
};

app.use(function (req, res, next) {
	if (req.secure) {
		next();
	} else {
		res.redirect("https://localhost" + req.url);
	}
}).use(bodyParser.json())
	.use(session({
		secret: 'conduit',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
		},
		store: new FileStore({
			path: '.sessions'
		})
	}))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: req => ({
				user: req.session && req.session.user
			})
		})
	);

http.createServer(app).listen(PORT_HTTP, _ => {
	console.log(`> Running on https://localhost:${PORT_HTTP}`)
});

https.createServer(options, app).listen(PORT, _ => {
	console.log(`> Running on https://localhost:${PORT}`)
});
