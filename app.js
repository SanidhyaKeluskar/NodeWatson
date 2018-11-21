var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var bodyParser = require('body-parser')
const express= require('express')
var mongoose= require('mongoose');

const app=express()
//use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true })
        .then(()=>console.log('mongodb connected'))
        .catch(err=>console.log(err))


var assistant = new AssistantV1({
  username: 'apikey',
  password: 'eHZn9TIsARfnFkF-hOVmUihbjFPmoxMLCjj_QljaHv5I',
  url: 'https://gateway-wdc.watsonplatform.net/assistant/api',
  version: '2018-02-16'
});

var user= mongoose.model('users',{Name:String,
                            Phone_number: String,
                            Date: String,
                            Time: String});

app.get('/test',(req,res)=>{
    user.find({},function(err,customers){
        res.send(customers)
    })
})

var context ={}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
app.post('/message',(req,res)=>{

    var user_message=req.body.message 
    
            assistant.message(
            {
                workspace_id: '7b33d520-7748-4a48-9889-ca8cff34482f',
                input: { text: user_message},
                context: context
            },
            function(err, response) {
                if (err) {
                console.error(err);
                } else {
                console.log(response);
                context=response.context
                   /* if(response.context.person!=null && response.context.time!=null && response.context.date!=null){
                        user.find({"Date": response.context.date,"Time": response.context.time},function(err,users){
                            if(isEmpty(users)){
                                callWatsonInternally("YES")
                                new user ({"Name": response.context.person, "Date": response.context.date,"Time": response.context.time}).save(function( err,users){
                                    console.log('sucessfully updated the database')
                                })
                            }
                            else{
                                callWatsonInternally("NO")
                            }
                        })
                    }*/
                   // if(response.intents[0].intent=='help'){
                    //    xcontext=response.context
                   // }
                    if(response.context.person!=null && response.context.time!=null && response.context.date!=null && response.context.number!=null && (response.context.number)/9>1)
                    {   

                        user.find({"Date": response.context.date,"Time": response.context.time},function(err,users){
                            if(isEmpty(users)){
                                
                                var numberofcustomer=response.context.number.toString();
                                new user ({"Name": response.context.person, "Phone_number": numberofcustomer,"Date": response.context.date,"Time": response.context.time}).save(function( err,users){
                                    console.log('sucessfully updated the database')
                                })
                                callWatsonInternally("YES")
                            }
                            else{
                            
                                callWatsonInternally("NO")
                            }
                        })

                        
                        
                    }
                }
            }
            );

res.end()
})

function callWatsonInternally(user_message){
     assistant.message(
        {
            workspace_id: '7b33d520-7748-4a48-9889-ca8cff34482f',
            input: { text: user_message},
            context: context
        },
        function(err, response) {
            if (err) {
            console.error(err);
            } else {
            console.log(response);
        }
    }
    );
}
    

app.listen(3000,()=>{
    console.log("server is listening")
})