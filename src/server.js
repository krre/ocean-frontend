import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
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
	.listen(PORT, err => {
		if (err) console.error('error', err);
	});
