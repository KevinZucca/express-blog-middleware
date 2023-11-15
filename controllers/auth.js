const generateJWT = require("../utilities/generateJWT");
const jsonUsers = require("../users.json");

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Bisogna inserire username e password");
    return;
  }

  const user = jsonUsers.find(
    (user) => user.username == username && user.password == password
  );
  if (!user) {
    res.status(401).send("Username e/o password errati");
    return;
  }

  const token = generateJWT(user);
  res.json({ token });
}

module.exports = {
  login,
};
