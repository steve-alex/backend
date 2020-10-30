import * as express from "express";

const app = express();

app.get("/postcode/:postcode", (req, res) => {
    const postcode = req.params.postcode;
    getLatlonFromPostcode(postcode).then(data => {
        res.send(data);
    });
});

export async function getLatlonFromPostcode(postcode) {
    return "51.5074, 0.1278";
}

export default app;



