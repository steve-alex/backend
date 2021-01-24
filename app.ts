import * as express from "express";
const axios = require('axios').default;
require('dotenv').config();

const app = express();

interface Location {
    coordinates: Coordinates,
    weather: Weather,
}

interface Coordinates {
    postcode: string,
    longitude: number,
    latitude: number,
}

interface Weather {
    description: string,
    temperature: number,
    feels_like: number,
    pressure: number,
    wind_speed: number
}

app.get("/postcode/:postcode", async (req: express.Request, res: express.Response) => {
    try {
        const postcodes = req.params.postcode.split(",");
        validatePostcodes(postcodes);
        const locations = await getLocationsFromPostcodes(postcodes);

        Promise.all(locations).then((result) => {
            return res.status(200).send(result);
        })
    } catch(error){
        return res.status(error.statusCode).send(error);
    }
});

async function getLocationsFromPostcodes(postcodes: any){
    try {
        const coordinatesArr = await getCoordinatesFromPostcodes(postcodes);

        const locations: Coordinates[] = coordinatesArr.map(async (coordinates: Coordinates) => {
            const weather = await getWeatherFromCoordinates(coordinates);
    
            const location: Location = {
                coordinates: coordinates,
                weather: weather
            }
            return location
        })
    
        return locations; 
    } catch (e) {
        throw new Error("Unable to get locations from postcode");
    }
}

export async function getCoordinatesFromPostcodes(postcodes: any){
    try {
        const response = await axios.post(`https://api.postcodes.io/postcodes/`, { postcodes })
        const coordinates = response.data.result.map((location: any) => {
            return {
                query: location.result.postcode,
                latitude: location.result.latitude,
                longitude: location.result.longitude
            }
        })  

        return coordinates
    } catch (e) {
        throw new Error("Could not get coordinates from poscodes")
    }
}

async function getWeatherFromCoordinates({ longitude, latitude }: Coordinates) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.openweatherkey}`)
        const weatherData = response.data;
        const weather: Weather = {
            description: weatherData.weather[0].main,
            temperature: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            pressure: weatherData.main.pressure,
            wind_speed: weatherData.wind.speed
        }

        return weather;
    } catch (e) {
        throw new Error("Unable to fetch weather from coordinates")
    }
}

const validatePostcodes = (postcodes: string[]) => {    
    var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 

    for (const postcode of postcodes){
        if (!postcodeRegEx.test(postcode)){
            throw new Error("Not a valid UK postcode")
        }
    }
}

export default app;
