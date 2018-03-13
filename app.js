var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Ship = require("./models/ship");
var Job = require("./models/job");

mongoose.connect("mongodb://localhost/workspace");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


//=========== JOB ROUTES ================
//=======================================

app.get("/", function(req, res){
    res.render("dboard");
});

// JOB SHOW ALL

app.get("/jobs", function(req,res){
    //Find all the jobs from DB and loop it
    Job.find({},function(err, alljobs){
        if(err){
            console.log(err);
        } else {
            res.render("jobs",{jobs:alljobs}); 
        }
    });
});

// JOB CREATE

app.post("/jobs", function(req, res){
    // Get the form data and add it into the array for now!
    
    var IMO = req.body.job.IMO;
   
    // FIND IMO FROM SHIP DB
    Ship.findOne({IMO: IMO}, function(err, foundShip){
        if(err){
            console.log(err);
        } else if(foundShip == null) {
            res.send("No ship found in Database");  // FIX THIS WITH BETTER ERROR HANDLING
        } else {
            // CREATE NEW JOB AND SAVE TO DB
            Job.create(req.body.job, function(err, newCreatedJob){
                if(err){
                    console.log(err);
                } else {
                    // SAVE CORRESPONDING DETAILS TO ARRAY
                    newCreatedJob.ship.push(foundShip);
                    newCreatedJob.save(function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            // console.log(data);
                             res.redirect("/jobs");
                        }
                    });
                        //Redirect to jobs page
                       
                }
            });
        }
    });
});

// JOB NEW FORM

app.get("/jobs/new", function(req, res){
    res.render("job-new");
});

// JOB DETAILS PAGE

app.get("/jobs/:id", function(req, res){
    // FIND THE JOB DETAILS WITH PROVIDED ID
    Job.findById(req.params.id).populate("ship").exec(function(err, foundjobDetails){
        if(err){
            console.log(err);
        } else {
            // console.log(foundjobDetails);
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
    Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJobDetails){
       if(err){
           console.log(err);
       } else {
           console.log(req.body.updatedJobDetails);
           res.redirect("/jobs/" + req.params.id);
       }
    });
});

// JOB DELETE
app.delete("/jobs/:id", function(req, res){
    Job.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/jobs");
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
    Ship.create(req.body.ship, function(err, newCreatedShip){
        if(err){
            console.log(err);
        } else {
            console.log(newCreatedShip);
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
    Ship.findByIdAndUpdate(req.params.id, req.body.ship, function(err, updatedShipDetails){
       if(err){
           console.log(err);
       } else {
           console.log(updatedShipDetails);
           res.redirect("/ships/" + req.params.id);
       }
    });
});

// SHIP DELETE

app.delete("/ships/:id", function(req, res){
    Ship.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/ships");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});