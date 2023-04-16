import app from "../../../api/app";
import request from "supertest";

describe("Healtcheck E2E", () => {
    it("Should return HTTP response with status 200", (done) => {
        request(app)
            .get("/")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if(err) throw err;
                done();
            });
    });
});
