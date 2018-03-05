var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("dboard");
});

app.get("/jobs", function(req,res){
    var jobs = [
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'},
        {'Job_number': 1, 'IMO': 123456, 'Agency': 'Sharaf', 'port': 'RT'}
        ];
    
   res.render("jobs",{jobs:jobs}); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});