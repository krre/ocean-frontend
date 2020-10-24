import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV, SSL_KEY, SSL_CERT } = process.env;
const dev = NODE_ENV === 'development';

const { createServer } = require('https');
const { readFileSync } = require('fs');

const options = {
	key: readFileSync(SSL_KEY),
	cert: readFileSync(SSL_CERT)
};

const { handler } = polka() // You can also use Express
	.use(bodyParser.json())
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
	)
	.get('*', (req, res) => {
		res.end(`POLKA: Hello from ${req.pathname}`);
	});

createServer(options, handler).listen(PORT, _ => {
	console.log(`> Running on https://localhost:${PORT}`);
});
