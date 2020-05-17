export function post(req, res) {
    req.session.user = req.body;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({}));
}
