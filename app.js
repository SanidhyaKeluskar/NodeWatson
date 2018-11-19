var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var bodyParser = require('body-parser')
const express= require('express')
var mongoose= require('mongoose');

const app=express()
//use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect('mongodb://127.0.0.1:27017/booking_db', { useNewUrlParser: true })
var assistant = new AssistantV1({
  username: 'apikey',
  password: 'eHZn9TIsARfnFkF-hOVmUihbjFPmoxMLCjj_QljaHv5I',
  url: 'https://gateway-wdc.watsonplatform.net/assistant/api',
  version: '2018-02-16'
});

var user= mongoose.model('customers',{Name:String,
                            Phone_number: String,
                            Date: String,
                            Time: String});

new user ({"Name": "Sam Smith", "Phone_number": "3222333333", "Date": "11/23/2018","Time": "9.30"}).save(function( err,customers){

})
app.get('/test',(req,res)=>{
    user.find({"Date": "11/23/2018","Time": "9.30"},function(err,customers){
        res.send(customers)
    })
})

var context ={}

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
        if(response.context.person!=null && response.context.time!=null && response.context.date!=null && response.context.number!=null)
        {
            console.log('hooray got all the values');
        }
    }
  }
);

res.end()
})


app.listen(3008,()=>{
    console.log("server is listening")
})