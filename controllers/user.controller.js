const User = require("../models/user");

exports.get = async function(req, res) {
  const user = req.query;
  try {
    //search by id
    if (user.id) {
      return res.send(await User.find({ _id: user.id }));
    }
    //Searches mongodb for everything
    else {
      return res.send(await User.find());
    }
  } catch (err) {
    return res.status(400).send({ error: `Could not get: ${err}` });
  }
};

//Edit user
exports.put = async function(req, res) {
  try {
    console.log("edited");
    console.log(req.params.id);
    User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(400).send({ error: `Could not edit user: ${err}` });
        }
      }
    );
    return res.send("edited " + req.params.id);
  } catch (err) {
    return res.status(400).send({ error: `Could not edit user: ${err}` });
  }
};

//Remove user
exports.del = async function(req, res) {
  const _id = req.params.id;
  try {
    console.log(_id);
    await User.findByIdAndDelete(_id);
    console.log("removed");
    return res.send("removed");
  } catch (err) {
    return res.status(400).send({ error: `Could not remove user: ${err}` });
  }
};
