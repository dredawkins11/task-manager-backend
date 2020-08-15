function error(err, req, res, next) {
  if (err.error != null) console.log(err);
}

module.exports = error;