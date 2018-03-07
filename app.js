var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("dboard");
});

 var jobs = [
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'}
        ];

var ships = [
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'},
    {'name': 'Nordic Hunter', 'IMO': 123456, 'call': 'LAOD5', 'flag':'Norway'}
    ];


app.get("/jobs", function(req,res){
   res.render("jobs",{jobs:jobs}); 
});

app.post("/jobs", function(req, res){
    // Get the form data and add it into the array for now!
    var Job_number = req.body.Job_number;
    var IMO = req.body.IMO;
    var Agency = req.body.Agency;
    var port = req.body.port;
    var newJob = {Job_number:Job_number, IMO:IMO , Agency:Agency, port:port};
    jobs.push(newJob);
    // Redirect to jobs page
    res.redirect("/jobs");
});

app.get("/jobs/new", function(req, res){
    res.render("new-job");
});

app.get("/ships", function(req, res){
    res.render("ships",{ships:ships});
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
    ships.push(newShip);
    // Redirect to ships page
    res.redirect("/ships");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});