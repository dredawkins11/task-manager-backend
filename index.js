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

