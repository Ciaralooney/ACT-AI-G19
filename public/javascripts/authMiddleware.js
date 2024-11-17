function ensureAuthenticated(req, res, next) {
    const publicPaths = ['/', '/accounts/login', '/accounts/register', '/accounts/request-password-reset'];
    // Handle dynamic paths
    const isPublicPath = publicPaths.includes(req.path) || req.path.startsWith('/accounts/reset-password/');

    if (req.session && req.session.userId) {
        return next();
    }

    console.log(req.path);

    if (isPublicPath || req.session?.userId) {
        return next();
    } else {
        // Store the original URL before redirecting
        req.session.returnTo = req.originalUrl;
        res.redirect('/accounts/login');
    }
}

module.exports = ensureAuthenticated;