var mongoose = require("mongoose");

var shipSchema = new mongoose.Schema({
    name: String,
    IMO: Number,
    call: String,
    county_of_registry: String,
    port_of_registry: String,
    vessel_owner: String,
    vessel_type: String,
    gross_tonnage: Number,
    date_of_construction: Date,
    totat_bw_cap: Number,
    bw_method: String,
    treat_sys_name: String,
    approved_by: String
});
module.exports = mongoose.model("Ship", shipSchema);
