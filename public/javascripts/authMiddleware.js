function ensureAuthenticated(req, res, next) {
    const publicPaths = ['/', '/accounts/login', '/accounts/register', '/accounts/request-password-reset'];
    if (req.session && req.session.userId) {
        return next();
    } 
    if (publicPaths.includes(req.path) || req.session?.userId) {
        return next();
    } else {
        // Store the original URL before redirecting
        req.session.returnTo = req.originalUrl;
        res.redirect('/accounts/login');
    }
}

module.exports = ensureAuthenticated;