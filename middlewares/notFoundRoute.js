module.exports = function (req, res, next) {
  res.status(404).send("<h1>La pagina a questo indirizzo non esiste</h1>");
};
