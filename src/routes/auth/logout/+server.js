export function POST(req, res) {
    delete req.session.user;
    res.end(JSON.stringify({}));
}
