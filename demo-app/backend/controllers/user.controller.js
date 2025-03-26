const User = require('../models/User');
const isInjection = require('../utils/injectionCheck');

exports.login = async (req, res) => {
  let { username, password } = req.body;

  try {
    username = JSON.parse(username);
  } catch (e) { }
  try {
    password = JSON.parse(password);
  } catch (e) { }

  let query;
  if (
    typeof username === 'object' &&
    (username.$where || username.$or || username.$ne || username.username || username.password)
  ) {
    query = username;
  } else {
    query = { username, password };
  }

  const queryString = `db.users.find(${JSON.stringify(query)})`;

  const malicious = await isInjection(queryString);
  if (malicious) {
    return res.status(400).json({
      message: '🚨 Injection detected!',
      queryUsed: query
    });
  }

  console.log('🔍 MongoDB Query:', JSON.stringify(query, null, 2));

  try {
    const user = await User.findOne(query);
    if (user) {
      return res.status(200).json({
        message: '✅ Login successful',
        queryUsed: query
      });
    }
    return res.status(401).json({
      message: '❌ Incorrect username or password',
      queryUsed: query
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      queryUsed: query
    });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const queryString = `db.users.insert({ username: "${username}", password: "${password}" })`;
  const malicious = await isInjection(queryString);
  if (malicious) {
    return res.status(400).json({ message: '🚨 Injection detected!' });
  }

  try {
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: '⚠️ Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    return res.status(201).json({ message: '✅ User registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};