const express = require('express');

const app = express();

app.get("/postcode/:postcode", (req, res) => {
    const postcode = req.params.postcode;
    getLatlonFromPostcode(postcode).then(data => {
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log( `server started at http://localhost:3000` );
});

async function getLatlonFromPostcode(postcode) {
    return "51.5074, 0.1278";
}

exports.getLatlonFromPostcode = getLatlonFromPostcode;




