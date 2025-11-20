const express = require("express");
const printerRoutes = require("./routes/printer");

const app = express();

app.use(express.json());
app.use("/printer", printerRoutes);

module.exports = app;
