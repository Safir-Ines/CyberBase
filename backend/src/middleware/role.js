// Usage: router.get('/x', auth, allow('ceo','manager'), handler)
module.exports = function allow(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden — requires role: ${allowedRoles.join(' / ')}` });
    }
    next();
  };
};
