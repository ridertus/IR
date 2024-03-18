const mongoose = require('mongoose');
exports.connect = () => {
    mongoose.connect('mongodb://localhost:27017/food', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('Database is connected'))
    .catch((e) => console.log(e));
};
