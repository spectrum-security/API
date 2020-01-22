const CompanyModel = require("../models/company");
const UserModel = require("../models/user");
const SensorModel = require("../models/sensor");
const TemplateEmailModel = require("../models/templateEmail");
const SentEmailModel = require("../models/sentEmail");
const logger = require("../helpers/logger");
const messages = require("../utils/jsonMessages");
const Handlebars = require("handlebars");
const mailHelper = require("../helpers/mailHelper");
const _ = require("lodash");

//Get a specific company from the database by name
exports.getCompanies = async (req, res, next) => {
  try {
    // pagination vars
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);
    const search = new RegExp(".*" + req.query.search + ".*", "i");

    const pagination = {
      skip: size * (page - 1),
      limit: size
    };

    const query = {};
    const searchForQuery = [];

    // maps trought fields and  creates RegExp for find query
    _.map(["name"], el => {
      if (req.query.search) searchForQuery.push({ [el]: search });
    });

    if (searchForQuery.length > 0) query.$or = searchForQuery;

    const totalRecords = await CompanyModel.countDocuments(query).lean();
    const companies = await CompanyModel.find(query)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate("mainAdmin")
      .lean();

    if (!companies)
      return res.status(404).send({ success: false, message: err.message });

    return res.status(200).send({
      success: true,
      content: { companies: companies },
      totalRecords: totalRecords
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};
//Get specific company from the database by id
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await CompanyModel.findOne({
      _id: req.params.id
    }).populate("mainAdmin");
    console.log(req.params.id);
    if (!company) return res.status(404).json({ message: "coisas" });
    return res.status(200).json({
      company: company
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCompanyUsers = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const users = await UserModel.find({ companyId: companyId })
      .populate("companyId")
      .lean();

    if (!users)
      return res.status(404).send({
        success: false,
        message:
          "No users which is weird cuz you must have a user when you creat a fucking company"
      });

    res.status(200).send({ success: true, content: { users: users } });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

//Delete a company
exports.deleteCompany = async (req, res, next) => {
  try {
    CompanyModel.deleteOne({ _id: req.params.id }, err => {
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

//Update a company
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await CompanyModel.findById(req.params.id).exec();
    if (!company)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    console.log(company);
    let query = { $set: {} };
    for (let key in req.body) {
      if (company[key] && company[key] !== req.body[key])
        // if the field we have in req.body exists, we're gonna update it
        query.$set[key] = req.body[key];
    }
    const updateCompany = await CompanyModel.findOneAndUpdate(
      { _id: req.params.id },
      query
    ).exec();
    console.log(updateCompany);
    res.send(updateCompany);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Add a new company to the DataBase
exports.postCompany = async (req, res, next) => {
  try {
    console.log(req.body);

    const userToSave = {
      email: req.body.user.email,
      name: req.body.user.name,
      password: req.body.password,
      avatar: req.body.user.avatar
    };

    const companyToSave = {
      name: req.body.company.name,
      offices: req.body.company.offices,
      paymentMethod: req.body.company.paymentMethod,
      image: req.body.company.image
    };

    const sensorToSave = {
      location: req.body.sensor.location,
      sensorType: req.body.sensorType
    };

    const newUser = new UserModel(userToSave);

    companyToSave.mainAdmin = newUser._id;

    const newCompany = new CompanyModel(companyToSave);

    newUser.companyId = newCompany._id;

    sensorToSave.companyId = newCompany._id;

    const newSensor = new SensorModel(sensorToSave);

    await newUser.save();
    await newCompany.save();
    await newSensor.save();

    const templateMessage = await TemplateEmailModel.findOne({
      type: 4
    }).lean();

    const template = Handlebars.compile(templateMessage.content);
    const emailToSend = template({
      user: { email: newUser.email, password: req.body.password }
    });

    const info = await mailHelper.sendMail(
      newUser.email,
      templateMessage.title,
      emailToSend
    );

    const sentEmail = new SentEmailModel({
      to: newUser.email,
      title: templateMessage.title,
      text: emailToSend
    });

    await sentEmail.save();

    logger.log({
      level: "info",
      message: "EMAIL SENT =>" + JSON.stringify(info)
    });

    res.status(203).send({ success: true });

    // await newCompany.save((err, doc) => {
    //   console.log("adicionado com sucesso");
    //   if (err) {
    //     res.status(500).send("erro de bd");
    //   } else {
    //     res.send(doc);
    //   }
    // });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
