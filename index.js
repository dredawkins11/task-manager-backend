const mongoose = require("mongoose");
const morgan = require("morgan")
const express = require("express");
const app = express();
const cors = require("cors");
const authenticateToken = require("./middleware/authenticateToken");
const tasks = require("./routes/tasks");
const users = require("./routes/users");
const login = require("./routes/login");
const error = require("./middleware/error");

mongoose
  .connect("mongodb+srv://adminDre:B8uXcWjsNgEGTtB@testcluster-brukg.gcp.mongodb.net/taskDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

morgan.token("token-sig", (req, res) => {
  const authHeader = req.headers["authorization"];
  const tokenSig = authHeader && authHeader.split(".")[2];
  return tokenSig;
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://task-manager-project-frontend.s3-website.us-east-2.amazonaws.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors());
app.use(express.json());
app.use(morgan(":date[web] :method :url :status :token-sig", { dev: true }))
app.use(authenticateToken);
app.use("/api/tasks", tasks);
app.use("/api/users", users);
app.use("/api/login", login);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

