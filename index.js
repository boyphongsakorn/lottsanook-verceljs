const express = require("express");
const app = express();
//const product = require("./api/product");
//const index = require("./api/index");
//const index2 = require("./api/index2");
const all = require("./api/all");

process.env.TZ = 'Asia/Bangkok'

app.use(express.json({ extended: false }));

app.use("/api/", all);
/*app.use("/api/", index);
app.use("/api/index2", index2);

app.use("/api/product", product);*/

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
