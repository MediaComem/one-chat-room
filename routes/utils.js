exports.route = func => (req, res, next) => Promise.resolve().then(() => func(req, res, next)).catch(next);
