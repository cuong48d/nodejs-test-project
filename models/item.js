var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
	date: Date,
	total_time: Number,
	notes: String,
    created_at: Date,
    updated_at: Date
})
ItemSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
module.exports = mongoose.model('Item', ItemSchema);