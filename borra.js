var mongoose = require("mongoose");
var Comment   = require("./models/comment");

function borrador(){
    //remove all campgrounds
    Comment.remove({}, function(err){
        if(err){
            console.log(err);
        }  console.log("removed campgrounds!");
    });
}
    module.exports = borrador;