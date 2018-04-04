var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var Ship = require("./models/ship");
var Job = require("./models/job");



mongoose.connect("mongodb://localhost/workspace");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));


// ===== PASSPORT CONFIGURATION =========
app.use(require("express-session")({
    secret: 'lets hope this works',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
     var today = new Date();
     var month = today.getMonth();
    //  console.log(month);
    // FIND ALL SURVEYORS
     User.find({role: "surveyor"}).sort({incentive: 'asc'}).exec(function(err, surveyors){
        if(err){
            console.log(err);
        } else {
            // console.log(surveyors);
            // FOR EACH SURVEYOR CALCULATE TOTAL INCENTIVE
            // surveyors.forEach(function(surveyor){
            //     // console.log(surveyor);
            //     // FIND ALL THE JOBS THE RESPECTIVE SURVERYORS HAVE CARIIED OUT
            //     Job.find({surveyor_name: surveyor.username}, function(err, foundJobs){
            //         var total = 0;
            //         if(err){
            //             console.log(err);
            //         } else {
            //             foundJobs.forEach(function(job){ 
            //                 // console.log(job.completed_date.getMonth());
            //                 if(job.completed_date.getMonth() == month){
            //                      total += job.trip_allowance + job.food_allowance;
            //                   } 
            //                 });
            //             // console.log(surveyor.username + " = " + total);
            //             // UPDATE IT TO THE DATABASE
            //             User.findOneAndUpdate({username:surveyor.username}, {$set: {incentive: total}}, {new: true}, function(err, updatedUser){
            //                 if(err){
            //                     console.log(err);
            //                 } else {
            //                     // console.log(updatedUser);
            //                 }
            //             });
            //         }
            //     });
                
            // });
        }
        res.render('./dboard', {surveyors: surveyors});
    });
});

//=========== JOB ROUTES ================
//=======================================

app.get("/jobs", isLoggedIn, function(req,res){
    //Find all the jobs from DB and loop it
    Job.find({}).sort({completed_date: 'desc'}).exec(function(err, alljobs){
        if(err){
            console.log(err);
        } else {
            res.render("jobs/jobs",{jobs:alljobs}); 
        }
    });
});

// JOB CREATE

app.post("/jobs", isLoggedIn, function(req, res){
    // Get the form data and add it into the array for now!
    var today = new Date();
     var month = today.getMonth();
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
                            User.find({}, function(err, surveyors){
                                if(err){
                                    console.log(err);
                                } else {
                                    surveyors.forEach(function(surveyor){
                                    // console.log(surveyor);
                                    // FIND ALL THE JOBS THE RESPECTIVE SURVERYORS HAVE CARIIED OUT
                                    Job.find({surveyor_name: surveyor.username}, function(err, foundJobs){
                                        var total = 0;
                                        if(err){
                                            console.log(err);
                                        } else {
                                            foundJobs.forEach(function(job){ 
                                                // console.log(job.completed_date.getMonth());
                                                if(job.completed_date.getMonth() == month){
                                                     total += job.trip_allowance + job.food_allowance;
                                                   } 
                                                });
                                            // console.log(surveyor.username + " = " + total);
                                            // UPDATE IT TO THE DATABASE
                                            User.findOneAndUpdate({username:surveyor.username}, {$set: {incentive: total}}, {new: true}, function(err, updatedUser){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    // console.log(updatedUser);
                                                }
                                            });
                                        }
                                    });
                                    
                                });
                                }
                            });
                            // console.log(data);
                            //Redirect to jobs page
                             res.redirect("/jobs");
                        }
                    });
                }
            });
        }
    });
});

// JOB NEW FORM

app.get("/jobs/new", isLoggedIn, function(req, res){
    res.render("jobs/job-new");
});

// JOB DETAILS PAGE

app.get("/jobs/:id", isLoggedIn, function(req, res){
    // FIND THE JOB DETAILS WITH PROVIDED ID
    Job.findById(req.params.id).populate("ship").exec(function(err, foundjobDetails){
        if(err){
            console.log(err);
        } else {
            // console.log(foundjobDetails);
            res.render("jobs/job-details", {jobDetails: foundjobDetails});
        }
    });
});

// JOB EDIT

app.get("/jobs/:id/edit", isLoggedIn, function(req, res){
    Job.findById(req.params.id, function(err, foundjobDetails){
        if(err){
            console.log(err);
        } else {
                res.render("jobs/job-edit", {jobDetails: foundjobDetails});
                // console.log(foundjobDetails);
        }
    });
});

// JOB UPDATE

app.put("/jobs/:id", isLoggedIn, function(req, res){
    Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJobDetails){
       if(err){
           console.log(err);
       } else {
        //   console.log(req.body.updatedJobDetails);
           res.redirect("/jobs/" + req.params.id);
       }
    });
});

// JOB DELETE
app.delete("/jobs/:id", isLoggedIn, function(req, res){
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

app.get("/ships", isLoggedIn, function(req, res){
    Ship.find({}, function(err, allships){
        if(err){
            console.log(err);
        } else {
            res.render("ships/ships",{ships:allships});
        }
    });
    
});

// SHIP - NEW - FORM

app.get("/ships/new", isLoggedIn, function(req, res){
    res.render("ships/ship-new");
});

// SHIP DETAILS PAGE

app.post("/ships", isLoggedIn, function(req, res){
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

app.get("/ships/:id", isLoggedIn, function(req, res){
    // FIND THE SHIP DETAILS WITH PROVIDED ID
    Ship.findById(req.params.id,function(err, foundShipDetails){
        if(err){
            console.log(err);
        } else {
            res.render("ships/ship-details", {shipDetails: foundShipDetails});
        }
    });
});

// SHIP EDIT

app.get("/ships/:id/edit", isLoggedIn, function(req, res){
    Ship.findById(req.params.id, function(err, foundShipDetails){
        if(err){
            console.log(err);
        } else {
                res.render("ships/ship-edit", {shipDetails: foundShipDetails});
                // console.log(foundShipDetails);
        }
    });
});

// SHIP UPDATE

app.put("/ships/:id", isLoggedIn, function(req, res){
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

app.delete("/ships/:id", isLoggedIn, function(req, res){
    Ship.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/ships");
        }
    });
});

app.get('/profile', isLoggedIn, function(req, res){
    // var presentUser = req.user;
    User.findOne({username: req.user.username}, function(err, foundUser){
        if(err){
            console.log(err);
        } 
        res.render('./profile', {foundUser: foundUser});
    });
});


// ========= AUTH ROUTES ===============
// =====================================

// SHOW REGISTER FORM

app.get('/register', function(req, res){
    res.render('register');
});

// HANDLE SIGN UP LOGIC

app.post('/register',  function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        } else {
            User.findOneAndUpdate({username: req.body.username}, {$set:{role: req.body.role}}, {new: true}, function(err, updatedUser){
                if(err){
                    console.log(err);
                } else {
                       passport.authenticate("local")(req, res, function(){
                            res.redirect('/');
                        });
                    }
            });
            
        }
    });
});

// SHOW LOGIN PAGE

app.get('/login', function(req, res){
    res.render('login');
});

// HANDLE LOGIN LOGIC

app.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
        
    }), function(req, res){
        
});

// LOGOUT ROUTE

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("GSA Workspace server has started!");
});