const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const upload = require("./helpers");
const FileModel = require("./models");

mongoose.connect("mongodb://localhost/file", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("THE DATABASEE IS CORRECTLY LUNCHED");
});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("uploads"));

app.post("/post", upload.single("file"), async (req, res) => {
  try {
    const { originalname, path, mimetype } = req.file;
    const { name } = req.body;

    const file = new FileModel({
      title: name,
      fileName: originalname,
      filePath: path,
      fileType: mimetype,
    });
    await file.save();
    res.status(201).json({ msg: "ADDED SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.get("/get", async (req, res) => {
  try {
    const result = await FileModel.find();

    res.status(201).json({ msg: "DATA GETED SUCCESSFULLY", result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ msg: "ID NOT FOUND" });
    }
    const file = await FileModel.findById({ _id: id });
    fs.unlink(file.filePath, async () => {
      const result = await FileModel.deleteOne({ _id: id });
      res.status(200).json({ msg: "FILE DELETED", result });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.listen(8080, () => console.log("API RUNNING IN PORT 8080"));
