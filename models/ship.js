var mongoose = require("mongoose");

var shipSchema = new mongoose.Schema({
    name: String,
    IMO: String,
    call: String,
    flag: String
});
module.exports = mongoose.model("Ship", shipSchema);
