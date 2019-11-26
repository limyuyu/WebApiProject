const mongoose = require('mongoose');
const db = 'mongodb+srv://limyuyu:12345@yuwei98-bcn7h.mongodb.net/Currency?retryWrites=true&w=majority';


// connect to mongoose database
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database ! Yeahh !');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  amount: { type: Number },
  base_currency_code: { type: String },
  base_currency_name: { type: String },
  rates: { type: String },
  status: { type: String },
  updated_date: { type: String },
  result:{type:Number},
  from:{type:String},
  to:{type:String}
});

const Currency = mongoose.model('Currency', schema, 'Currency');

module.exports = Currency;
