const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const FileModel = mongoose.model("fileDB", FileSchema);
module.exports = FileModel;
