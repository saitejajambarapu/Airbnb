const mongooose = require("mongoose");
const Listing = require("../models/listings.js");
const initdata = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(e);
})
async function main() {
    await mongooose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({
        ...obj, 
        owner: "6710ead4b38c5762ba8fbb68"}));
    await Listing.insertMany(initdata.data);
    console.log("init data saved");
}

initDB();