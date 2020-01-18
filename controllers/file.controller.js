const { mongo, connection } = require("mongoose");
const Grid = require("gridfs-stream");
Grid.mongo = mongo;
let gfs = Grid(connection);

exports.getImage = async (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No File Exists" });
    } else {
      // Check if is image
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        // Read output to broswer
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({ err: "Not an image" });
      }
    }
  });
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    console.log(req.file);
    res.status(203).send({ success: true, fileId: req.file.filename });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
