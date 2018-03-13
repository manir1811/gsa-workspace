var mongoose = require("mongoose");

var shipSchema = new mongoose.Schema({
    name: String,
    IMO: String,
    call: String,
    county_of_registry: String,
    port_of_registry: String,
    vessel_owner: String,
    vessel_type: String,
    gross_tonnage: String,
    date_of_construction: String,
    total_bw_cap: String,
    bw_method: String,
    treat_sys_name: String,
    approved_by: String
});
module.exports = mongoose.model("Ship", shipSchema);
