import * as express from "express";
const axios = require('axios').default;

const app = express();

interface Coordinates {
    postcode: string,
    longitude: number,
    latitude: number,
}

app.get("/postcode/:postcode", (req: express.Request, res: express.Response) => {
    const postcodes = req.params.postcode.split(",");

    validatePostcodes(postcodes);

    getCoordinatesFromPostcodes(postcodes)
        .then(coordinatesData => console.log(coordinatesData))
        .catch(error => console.log(error))
});

export async function getCoordinatesFromPostcodes(postcodes: any) {
    return axios.post(`https://api.postcodes.io/postcodes/`, { postcodes })
        .then((response: any) => {
            const coordinates: Coordinates = response.data.result.map((location: any) => {
                return {
                    postcode: location.result.postcode,
                    longitude: location.result.longitude,
                    latitude: location.result.latitude
                }
            })

            return coordinates;
        })
        .catch((error: any) => {
            throw new Error("Unable to fetch coordinates from postcodes")
        })
}

const validatePostcodes = (postcodes: string[]) => {    
    var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 

    for (const postcode of postcodes){
        if (!postcodeRegEx.test(postcode)){
            throw new Error("Not a valid UK postcode");
        }
    }
}



export default app;



