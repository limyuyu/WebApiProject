const express = require('express');
const app = express();
const axios = require('axios');  //API purpose
const Currency = require('./currency'); //mongo database purpose

const apikey = '5f618b00d2mshbae7d404e662dc5p1d360ejsnef3ac92d4896';

//get all currency data
app.get('/getAllCurrency', async(req, res) => {
  
  var header = {
    "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
    "x-rapidapi-key": "5f618b00d2mshbae7d404e662dc5p1d360ejsnef3ac92d4896"
  }
  
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  dd = dd < 10 ? dd = '0'+ dd : dd;
  mm = mm < 10 ? mm = '0'+ mm : mm; 


  var link = `https://currency-converter5.p.rapidapi.com/currency/historical/${yyyy+'-'+ mm + '-'+ dd}`;
  // res.send(link)
  
  await axios.get(link,{
    headers:header
})
  .then(response => {
    res.send(response.data)
  })
})

//get selected currency data
app.get('/ConvertCurrency',  (req, res) => {
  
  var header = { 
    "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
    "x-rapidapi-key": "5f618b00d2mshbae7d404e662dc5p1d360ejsnef3ac92d4896"
  }
  
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  dd = dd < 10 ? dd = '0'+ dd : dd;
  mm = mm < 10 ? mm = '0'+ mm : mm; 

  var concat = `?format=json&to=${req.query.to}&from=${req.query.from}&amount=${req.query.amount}`
  var link = `https://currency-converter5.p.rapidapi.com/currency/historical/${yyyy+'-'+ mm + '-'+ dd + concat}`;

  axios
    .get(link,{
      headers:header
})
  .then( response => {
    var base = response.data;
    //res.send(base)
    var data = {
      amount: base.amount,
      base_currency_code: base.base_currency_code,
      base_currency_name: base.base_currency_name,
      rates: base.rates[req.query.to].rate,
      status: base.status,  
      updated_date: base.updated_date,
      result: base.rates[req.query.to].rate_for_amount,
      from : req.query.from,
      to : req.query.to
    }
    //res.send(data)
    var fullData = new Currency(data);
     fullData.save()
    res.send(fullData)

  })
})

app.get('/getCurrencyList', (req, res) => {
  axios({
    "method":"GET",
    "url":"https://currency-converter5.p.rapidapi.com/currency/list",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"currency-converter5.p.rapidapi.com",
    "x-rapidapi-key":"5f618b00d2mshbae7d404e662dc5p1d360ejsnef3ac92d4896"
    },"params":{
    "format":"json"
    } 
    })

    // convert object from API and save in array.
    .then((response)=>{
      var myObject = response.data.currencies;
      var arr = [];
      for (var key in myObject) {
          arr.push({"basedCurrencyCode" : key,"CurrencyName" : myObject[key]})
      }
      res.send(arr)
    })
    .catch((error)=>{
      console.log(error)
    })
});


//localhost:5000/deletemovie?title=MovieTitle
app.get('/deleteCurrency', (req, res) => {
  Currency.deleteMany({ id: req.query.id })
    .then(response => {
      res.status(200).json(response);
    })  
    .catch(error => {
      res.status(400).json(error);
    });
});

app.get('/getAll', async (req,res)=>{
  res.send(await Currency.find({}));
})
app.get('/deleteOne', async (req,res)=>{
  res.send(await Currency.findByIdAndDelete(req.query.id));
})

//HAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHAfkjsdhfkjsdf

app.listen(5000, () => {
  console.log('server listening on port 5000');
});
