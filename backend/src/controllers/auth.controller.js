const jwt = require('jsonwebtoken');
const store = require('../config/demoStore');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'demo_secret_key', { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role = 'employee', organizationName, industry, size } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });

  const exists = store.findUserByEmail(email);
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  let organization;
  if (organizationName) {
    organization = store.findOrgByName(organizationName);
    if (!organization) organization = store.createOrg({ name: organizationName, industry, size });
  } else {
    organization = store.createOrg({ name: name + "'s Organization" });
  }

  const userCountInOrg = store.countUsersByOrg(organization._id);
  const finalRole = userCountInOrg === 0 ? 'ceo' : role;
  const user = store.createUser({ name, email, password, role: finalRole, organization: organization._id });

  res.status(201).json({ token: sign(user._id), user: store.safeUser(user), organization });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = store.findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!store.checkPassword(user, password)) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ token: sign(user._id), user: store.safeUser(user) });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  const org = store.findOrg(req.user.organization);
  res.json({ user: store.safeUser(req.user), organization: org });
};
