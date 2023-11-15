const generateJWT = require("../utilities/generateJWT");
const jsonUsers = require("../users.json");

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error("Bisogna inserire username e password");
  }

  const user = jsonUsers.find(
    (user) => user.username == username && user.password == password
  );
  if (!user) {
    throw new Error("Username e/o password errati");
  }

  const token = generateJWT(user);
  res.json({ token });
}

module.exports = {
  login,
};
