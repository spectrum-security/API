const CompanyModel = require("../models/company");
const messages = require("../utils/jsonMessages");
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
    const company = await (
      await CompanyModel.findOne({ _id: req.params.id })
    ).populated("mainAdmin");
    console.log(req.params.id);
    if (!company) return res.status(404).json({ message: err.message });
    return res.status(200).json({
      company: company
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
    let newCompany = new CompanyModel(req.body);
    console.log(req.body);
    await newCompany.save((err, doc) => {
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
