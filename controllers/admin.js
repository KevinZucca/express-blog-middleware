function index(req, res) {
  res.send(`Benvenuto ${req.user.username} nella home page dell'admin`);
}

module.exports = {
  index,
};
