var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/workspace");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// SCHEMA SETUP
var jobSchema = new mongoose.Schema({
    job_num: String,
    IMO: String,
    agency: String,
    port: String
});

var Job = mongoose.model("Job", jobSchema);

var shipSchema = new mongoose.Schema({
    name: String,
    IMO: String,
    call: String,
    flag: String
});

var Ship = mongoose.model("Ship", shipSchema);

//=========== JOB ROUTES ================
//=======================================

app.get("/", function(req, res){
    res.render("dboard");
});

app.get("/jobs", function(req,res){
    //Find all the jobs from DB and loop it
    Job.find({}, function(err, alljobs){
        if(err){
            console.log(err);
        } else {
            res.render("jobs",{jobs:alljobs}); 
        }
    });
});

app.post("/jobs", function(req, res){
    // Get the form data and add it into the array for now!
    var job_num = req.body.job_num;
    var IMO = req.body.IMO;
    var agency = req.body.agency;
    var port = req.body.port;
    var newJob = {job_num:job_num, IMO:IMO , agency:agency, port:port};
    // CREATE NEW JOB AND SAVE TO DB
    Job.create(newJob, function(err, newCreatedJob){
        if(err){
            console.log(err);
        } else {
                // Redirect to jobs page
                res.redirect("/jobs");
        }
    });
});

app.get("/jobs/new", function(req, res){
    res.render("job-new");
});

app.get("/jobs/:id", function(req, res){
    // FIND THE JOB DETAILS WITH PROVIDED ID
    Job.findById(req.params.id,function(err, foundjobDetails){
        if(err){
            console.log(err);
        } else {
            res.render("job-details", {jobDetails: foundjobDetails});
        }
    });
});

// JOB EDIT

app.get("/jobs/:id/edit", function(req, res){
    Job.findById(req.params.id, function(err, foundjobDetails){
        if(err){
            console.log(err);
        } else {
                res.render("job-edit", {jobDetails: foundjobDetails});
                // console.log(foundjobDetails);
        }
    });
});

// JOB UPDATE

app.put("/jobs/:id", function(req, res){
    Job.findByIdAndUpdate(req.params.id, req.body.jobDetails, function(err, updatedJobDetails){
       if(err){
           console.log(err);
       } else {
           res.redirect("/jobs/" + req.params.id);
       }
    });
});

//============== SHIP ROUTES ====================
//===============================================

app.get("/ships", function(req, res){
    Ship.find({}, function(err, allships){
        if(err){
            console.log(err);
        } else {
            res.render("ships",{ships:allships});
        }
    });
    
});

// SHIP - NEW - FORM

app.get("/ships/new", function(req, res){
    res.render("ship-new");
});

// SHIP DETAILS PAGE

app.post("/ships", function(req, res){
    // Get the form data and add it into the array for now!
    var name = req.body.name;
    var IMO = req.body.IMO;
    var call = req.body.call;
    var flag = req.body.flag;
    var newShip = {name:name, IMO:IMO , call:call, flag:flag};
    // CREATE NEW JOB AND SAVE TO DB
    Ship.create(newShip, function(err, newCreatedShip){
        if(err){
            console.log(err);
        } else {
                // Redirect to jobs page
                res.redirect("/ships");
        }
    });
});

// SHIP DETAILS

app.get("/ships/:id", function(req, res){
    // FIND THE SHIP DETAILS WITH PROVIDED ID
    Ship.findById(req.params.id,function(err, foundShipDetails){
        if(err){
            console.log(err);
        } else {
            res.render("ship-details", {shipDetails: foundShipDetails});
        }
    });
});

// SHIP EDIT

app.get("/ships/:id/edit", function(req, res){
    Ship.findById(req.params.id, function(err, foundShipDetails){
        if(err){
            console.log(err);
        } else {
                res.render("ship-edit", {shipDetails: foundShipDetails});
                // console.log(foundShipDetails);
        }
    });
});

// SHIP UPDATE

app.put("/ships/:id", function(req, res){
    Ship.findByIdAndUpdate(req.params.id, req.body.shipDetails, function(err, updatedShipDetails){
       if(err){
           console.log(err);
       } else {
           console.log(updatedShipDetails);
           res.redirect("/ships/" + req.params.id);
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});