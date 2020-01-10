//INCOMPLETE

const Request = require("../models/request");

exports.getRequest = async function (req, res) {
  const request = req.query;
  try {
    //search by id
    if (request.id) {
      return res.send(await Request.findOne({ _id: request.id }).lean());
    }
    //Searches mongodb for everything
    else {
      var perPage = request.perPage
      var page = request.page

      const returnedRequests = await Request.find()
        .select('name')
        .limit(perPage)
        .skip(perPage * page)
        .sort({
          date: 'desc'
        })
      return res.send(returnedRequests);
    }
  } catch (err) {
    return res.status(400).send({ error: `Could not get: ${err}` });
  }
};

//Post request (INCOMPLETE)
exports.postRequest = async (req, res, next) => {
  try {
    if (req.params.companyId && req.params.date) {
      let newRequest = new Request({
        companyId = req.params.companyId,
        date = req.params.date
      })

      console.log(newRequest)
      await newRequest.save((err, doc) => {
        console.log("Request added successfully")
        if (err) {
          res.status(500).send("Database Error")
        } else {
          res.send(doc)
        }
      })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

//Edit request
exports.putRequest = async function (req, res) {
  try {
    console.log("edited");
    console.log(req.params.id);
    Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(400).send({ error: `Could not edit request: ${err}` });
        }
      }
    );
    return res.send("edited " + req.params.id);
  } catch (err) {
    return res.status(400).send({ error: `Could not edit request: ${err}` });
  }
};

//Remove request
exports.delRequest = async function (req, res) {
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
exports.finishRequest = async function (req, res) {
  const _id = req.params.id;
  try {
    console.log(_id);
    await Request.findByIdAndUpdate(_id, {finished: true}, {upsert: true}, function(err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send('Succesfully saved.');
  });
    console.log("marked as finished");
  } catch (err) {
    return res.status(400).send({ error: `Could not mark request as finished: ${err}` });
  }
};
