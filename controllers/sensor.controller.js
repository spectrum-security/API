const SensorModel = require("../models/sensor.js");

//Get All sensors
exports.getSensors = async (req, res, next) => {
  try {
    console.log(req.body);
    const sensors = await SensorModel.find();

    if (!sensors)
      return res
        .status(404)
        .json({ success: false, message: " No sensor found" });

    return res.status(200).json({
      sensors: sensors
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all sensors of one company company
exports.getCompanySensorsList = async (req, res) => {
  try {
    const companyId = req.params.id;

    // if the query params are undefined it wont paginate
    //  returning all the documents it finds
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);

    // set skip and size of pagination query
    const pagination = {
      skip: size * (page - 1), // -1 because query.page starts at 1
      limit: size
    };

    // counts total records for pagination calculation in frontend
    const totalRecords = await SensorModel.countDocuments({
      companyId: companyId
    }).lean(); // lean() to set it as json and not mongo weird type

    const sensorsList = await SensorModel.find({ companyId: companyId })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).send({
      success: true,
      content: {
        sensors: sensorsList
      },
      totalRecords: totalRecords
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

//Get sensor by id
exports.getSensorById = async (req, res, next) => {
  try {
    const sensor = await SensorModel.findOne({ _id: req.params.id });

    if (!sensor) return res.status(404).json({ message: err.message });

    return res.status(200).json({
      sensor: sensor
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Post sensor
exports.postSensor = async (req, res, next) => {
  try {
    let newSensor = new SensorModel(req.body);
    console.log(req.body);
    await newSensor.save((err, doc) => {
      console.log("adicionado com sucesso");
      if (err) {
        res.status(500).send("erro de bd");
      } else {
        res.send(doc);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Delete sensor
exports.deleteSensor = async (req, res, next) => {
  try {
    SensorModel.deleteOne({ _id: req.params.id }, err => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(200).json({
        message: "deleted"
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Update a sensor
exports.updateSensor = async (req, res, next) => {
  try {
    const sensor = await SensorModel.findById(req.params.id).exec();
    if (!sensor)
      return res
        .status(404)
        .send("The sensor with the given ID was not found.");
    console.log(sensor);
    let query = { $set: {} };
    for (let key in req.body) {
      if (sensor[key] && sensor[key] !== req.body[key])
        // if the field we have in req.body exists, we're gonna update it
        query.$set[key] = req.body[key];
    }
    const updatedSensor = await SensorModel.findOneAndUpdate(
      { _id: req.params.id },
      query
    ).exec();
    console.log(updatedSensor);
    res.send(updatedSensor);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
