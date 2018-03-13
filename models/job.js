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


var jobSchema = new mongoose.Schema({
    job_num: String,        
    job_num_month: String,  
    IMO: String,            
    agency: String,
    // port: String,
    sampling_pt: String,
    sampling_time: String,
    iopp: String,           
    last_port: String,
    level_1: String,        
    level_2: String,        
    result: String,
    notified_date: Date,  // CHANGE TEH STRING TO DATE
    completed_date: Date,  // CHANGE TEH STRING TO DATE
    machine_num: String,    
    time_out: String,       
    time_in: String,        
    total_trip_time: String,
    trip_allowance: String, // CHANGE TEH STRING TO String
    food_allowance: String, // CHANGE TEH STRING TO String
    city: String,           
    terminal: String,       
    surveyor_name: String,
    pass_used: String,
    report_in_hand: String,
    test_result: String,
    invoice_to: String,
    invoice_amt: String,
    invoice_vat: String,
    invoice_num: String,
    due_date: String,
    commision1_to: String,
    comission1: String,
    commision2_to: String,
    payment_type: String,
    cn_issued: String,
    cn_delivered: String,
    paid: String,
    remarks: String,
    ship: [shipSchema]
});


module.exports = mongoose.model("Job", jobSchema);