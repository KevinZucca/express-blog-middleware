module.exports = function (err, req, res, next) {
  res.format({
    json: () => {
      res.status(500).json({
        message: "Si è verificato un errore",
        error: err.message,
        errorInstance: err.name,
      });
    },
    default: () => {
      res.status(500).send("<h1>Si è verificato un errore</h1>");
    },
  });
};
