var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/workspace");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

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
    Flag: String
});

var Ship = mongoose.model("Ship", shipSchema);

// ROUTES

app.get("/", function(req, res){
    res.render("dboard");
});

// var ships = [
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
//     {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'}
//     ];


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
    console.log(newJob);
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
    res.render("new-job");
});

app.get("/ships", function(req, res){
    Ship.find({}, function(err, allships){
        if(err){
            console.log(err);
        } else {
            res.render("ships",{ships:allships});
        }
    });
    
});

app.get("/ships/new", function(req, res){
    res.render("ship-new");
});

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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});