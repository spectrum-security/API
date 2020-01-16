const TemplateEmailModel = require("../models/templateEmail");
const _ = require("lodash");
const mailHelper = require("../helpers/mailHelper");
const logger = require("../helpers/logger");
const Handlebars = require("handlebars");

exports.getTemplateEmail = async (req, res) => {
  try {
    // pagination vars
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);
    // const orderBy = req.query.orderBy;
    // const orderType = req.query.orderType;
    const search = req.query.search
      ? new RegExp(".*" + req.query.search + ".*", "i")
      : "";

    // set skip and size of pagination query
    const pagination = {
      skip: size * (page - 1), // -1 because query.page starts at 1
      limit: size
    };

    const query = {};
    const searchForQuery = [];

    // maps trought fields and  creates RegExp for find query
    _.map(["title", "type"], el => {
      if (req.query.search) searchForQuery.push({ [el]: search });
    });

    // defines query if search isnt empty
    if (searchForQuery.length > 0) query.$or = searchForQuery;

    const totalRecords = await TemplateEmailModel.countDocuments(query).lean();
    const templates = await TemplateEmailModel.find(
      query,
      {},
      pagination
    ).lean();

    return res.status(200).send({
      success: true,
      content: { templates: templates },
      totalTemplates: totalRecords,
      types: TemplateEmailModel.types,
      status: 200
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.createTemplateEmail = async (req, res) => {
  try {
    const newTemplateEmail = {
      title: req.body.title,
      type: req.body.type,
      content: req.body.content
    };
    const template = new TemplateEmailModel(newTemplateEmail);
    await template.save();

    return res
      .status(201)
      .send({ success: true, message: "Template saved with success" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.editTemplateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await TemplateEmailModel.findById(id);

    if (!entry)
      return res
        .status(404)
        .send({ success: false, message: "Template email not found" });

    entry.title = req.body.title ? req.body.title : null;
    entry.type = req.body.type ? req.body.type : null;
    entry.content = req.body.content ? req.body.content : null;

    await entry.save();
    return res
      .status(200)
      .send({ success: true, message: "Template email was edited" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.deleteTemplateEmail = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await TemplateEmailModel.findOneAndDelete({ _id: id });

    if (!deleted)
      return res
        .status(404)
        .send({ success: false, message: "Template email was not found" });

    return res
      .status(200)
      .send({ success: true, message: "Template email deleted" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.setDefaultTemplateEmail = async (req, res) => {
  try {
    const id = req.body._id;
    const getTemplate = await TemplateEmailModel.findById(id).lean();
    await TemplateEmailModel.updateMany(
      { type: getTemplate.type },
      { defaultTemplate: false }
    );

    if (!getTemplate)
      return res
        .status(404)
        .send({ success: false, message: "Template Email was not found" });

    getTemplate.defaultTemplate = true;
    await getTemplate.save();

    return res
      .status(200)
      .send({ success: true, message: "Template Email chosen set as default" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.getTemplateEmailTypes = async (req, res) => {
  try {
    let getTypes = TemplateEmailModel.types;
    if (req.query.search) {
      getTypes = _.filter(getTypes, el => {
        return new RegExp(".*" + req.query.search + ".*", "i").test(el.label);
      });
    }
    const getTemplates = await TemplateEmailModel.find({
      defaultTemplate: true
    }).lean();

    _.map(getTypes, el => {
      el.defaultTemplate = _.find(getTemplates, tempTemplate => {
        return tempTemplate.tipo == el.value;
      });
    });

    return res.status(200).send({
      success: true,
      content: { types: getTypes },
      totalRecords: getTypes.length,
      status: 200
    });
  } catch (error) {
    console.log(error);
  }
};

exports.sendEmailTo = async (req, res) => {
  const { to, subject, message, templateType, templateTitle } = req.body;

  try {
    const templateMessage = await TemplateEmailModel.findOne({
      type: templateType,
      title: templateTitle
    }).lean();

    const template = Handlebars.compile(templateMessage.content);
    const test = template({
      user: { email: "iminyourpie@gmail.com", password: "hdhshsss" }
    });

    console.log(test);
    const info = await mailHelper.sendMail(to, subject, test);
    logger.log({
      level: "info",
      message: "EMAIL SENT =>" + JSON.stringify(info)
    });

    return res.status(200).send({ success: true, message: "Email sent" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};
