const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})


app.post("/",function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;


    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us19.api.mailchimp.com/3.0/lists/b778aee489";

    const options = {
        method: "POST",
        auth: "abbeyme:bfa620ef11b390ca4247d5d5c6718430-us19"

    }
    
    const request = https.request(url,options,function(response){

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        
        }
        else{
            res.sendFile(__dirname + "/failure.html");
            // res.send("nop");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

})


app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(req,res){
    console.log("server is running at port 3000");
})

