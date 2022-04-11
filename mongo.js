const mongoose = require('mongoose');
const config = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 30000
};

mongoose.connect(`mongodb://localhost:27017/myonecareDB`, config);

const db = mongoose.connection;

db.once('open', () => {
    console.warn(`Connected to the ${db.name} database on ${db.host}`)
});