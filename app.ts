import * as express from "express";
const axios = require('axios').default;

const app = express();



app.get("/postcode/:postcode", (req, res) => {
    const postcodes = req.params.postcode.split(",");

    validatePostcodes(postcodes);

});

const validatePostcodes = (postcodes: string[]) => {    
    var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 

    for (const postcode of postcodes){
        if (!postcodeRegEx.test(postcode)){
            throw new Error("Not a valid UK postcode")
        }
    }
}

export async function getLatlonFromPostcode(postcode: any) {
    return "51.5074, 0.1278";
}

export default app;



