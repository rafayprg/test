const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// USE THE ENVIRONMENT VARIABLE HERE

// const connectionString = process.env.MONGODB_URI || "mongodb+srv://rahaafinternational_db_user:g2SARe2fyQri6vlH@rahaaf.9hceoli.mongodb.net/?appName=Rahaaf";
mongoose.connect('mongodb://127.0.0.1:27017/appcreatenode');
// mongoose.connect(connectionString);

const userSchema = mongoose.Schema({
     email: String,
     role: {
        type: String,
        default: 'customer'
    }
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);