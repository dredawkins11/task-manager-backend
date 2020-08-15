function logger(req, res, next) {
  const date = new Date()
  console.log(`\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
  console.log(`${req.method} request to "${req.url}" : `)
  console.log(req.body)
  console.log("\n")
  next();
}

module.exports = logger;