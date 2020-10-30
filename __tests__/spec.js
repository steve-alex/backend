import { getLatlonFromPostcode } from "../app";

describe("getLatlonFromPostcode", () => {
    test("it should return latlon for given postcode", async () => {
        const latlon = await getLatlonFromPostcode("1234");
        expect(latlon).toEqual("51.5074, 0.1278");
    })
})