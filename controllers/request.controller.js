//INCOMPLETE
const _ = require("lodash");
const Request = require("../models/request");
const msg = require("../utils/jsonMessages");

exports.getRequest = async function(req, res) {
  const request = req.query;
  try {
    //search by id
    if (request.id) {
      return res.send(await Request.findOne({ _id: request.id }).lean());
    }
    //Searches mongodb for everything
    else {
      // pagination vars
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.perPage);
      console.log(req.query.perPage);
      const orderBy = req.query.orderBy;
      const orderType = req.query.orderType;
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
      _.map(["companyId.name", "date"], el => {
        if (req.query.search) searchForQuery.push({ [el]: search });
      });

      // defines query if search isnt empty
      if (searchForQuery.length > 0) query.$or = searchForQuery;

      // counts total requests for pagination calculation in frontend
      const totalRequests = await Request.countDocuments(query).lean();
      console.log(pagination);
      const requests = await Request.find(query)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ [orderBy]: orderType })
        .populate("companyId")
        .lean();

      return res.status(msg.request.getRequests.status).send({
        totalRequests: totalRequests,
        status: msg.request.getRequests.status,
        content: { requests: requests },
        success: msg.request.getRequests.success
      });
    }
  } catch (err) {
    return res.status(400).send({ error: `Could not get: ${err}` });
  }
};

//Post request (INCOMPLETE)
exports.postRequest = async (req, res, next) => {
  try {
    if (req.params.companyId && req.body.date) {
      let newRequest = new Request({
        companyId: req.params.companyId,
        date: req.body.date
      });

      console.log(newRequest);
      await newRequest.save((err, doc) => {
        console.log("Request added successfully");
        if (err) {
          res.status(500).send("Database Error");
        } else {
          res.send(doc);
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Edit request
exports.putRequest = async function(req, res) {
  try {
    console.log("edited");
    console.log(req.params.id);
    Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, data) => {
        if (err) {
          return res
            .status(400)
            .send({ error: `Could not edit request: ${err}` });
        }
      }
    );
    return res.send("edited " + req.params.id);
  } catch (err) {
    return res.status(400).send({ error: `Could not edit request: ${err}` });
  }
};

//Remove request
exports.delRequest = async function(req, res) {
  const _id = req.params.id;
  try {
    console.log(_id);
    await Request.findByIdAndDelete(_id);
    console.log("removed");
    return res.send("removed");
  } catch (err) {
    return res.status(400).send({ error: `Could not remove request: ${err}` });
  }
};

//Mark Request as Finished
exports.finishRequest = async function(req, res) {
  const _id = req.params.id;
  try {
    console.log(_id);
    await Request.findByIdAndUpdate(
      _id,
      { finished: true },
      { upsert: true },
      function(err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send("Succesfully saved.");
      }
    );
    console.log("marked as finished");
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Could not mark request as finished: ${err}` });
  }
};
