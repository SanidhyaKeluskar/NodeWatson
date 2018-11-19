var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var bodyParser = require('body-parser')
const express= require('express')
const app=express()
//use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
var assistant = new AssistantV1({
  username: 'apikey',
  password: 'eHZn9TIsARfnFkF-hOVmUihbjFPmoxMLCjj_QljaHv5I',
  url: 'https://gateway-wdc.watsonplatform.net/assistant/api',
  version: '2018-02-16'
});
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