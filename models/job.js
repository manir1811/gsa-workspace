var mongoose = require("mongoose");

var jobSchema = new mongoose.Schema({
    job_num: String,
    IMO: String,
    agency: String,
    port: String,
    ship: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "Ship"
        }
    ]
});

module.exports = mongoose.model("Job", jobSchema);