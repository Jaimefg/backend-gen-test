import app from "../../../api/app";
import request from "supertest";
describe("Genially E2E", () => {
    describe("Get geniallys", () => {
        it("Should return empty geniallys: HTTP 200", (done) => {
            request(app)
                .get("/genially")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).toHaveLength(0);
                    done();
                });
        });

        it("Should return empty geniallys with bad values of sizes/page: HTTP 200", (done) => {
            request(app)
                .get("/genially?size=0&page=-1")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).toHaveLength(0);
                    done();
                });
        });

        it("Should return 2 geniallys: HTTP 200", (done) => {
            const mockGenially1 = { name: "genially1", description: "testDescription 1" };
            const mockGenially2 = { name: "genially2", description: "testDescription 2" };

            request(app)
                .post("/genially")
                .send(mockGenially1)
                .end(() => {
                    request(app)
                        .post("/genially")
                        .send(mockGenially2)
                        .end(() => {
                            request(app)
                                .get("/genially?size=5&page=1")
                                .expect("Content-Type", /json/)
                                .expect(200)
                                .end((err, res) => {
                                    if(err) throw err;
                                    expect(res.body).toHaveLength(2);
                                    done();
                                });
                        });
                });
        });
    });
    describe("Add geniallys", () => {
        it("Should fail adding genially empty name: HTTP 400 (Name too short)", (done) => {
            const mockGenially = { name: "", description: "mockDescription"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("A name should be provided");
                    done();
                });
        });

        it("Should fail adding genially without name: HTTP 400 (Name too short)", (done) => {
            const mockGenially = { description: "mockDescription"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("A name should be provided");
                    done();
                });
        });

        it("Should fail adding genially: HTTP 400 (Name too short)", (done) => {
            const mockGenially = { name: "ab", description: "mockDescription"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Name should have at least 3 characters");
                    done();
                });
        });

        it("Should fail adding genially: HTTP 400 (Name too long)", (done) => {
            const mockGenially = { name: "NAME TOO LONG: AAAAAAAAAAAAAA", description: "mockDescription"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Name should have a maximum of 20 characters");
                    done();
                });
        });

        it("Should fail adding genially: HTTP 400 (Missing description)", (done) => {
            const mockGenially = { name: "mockGenially"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Genially should have description");
                    done();
                });
        });

        it("Should return error adding genially: HTTP 400 (Description to long)", (done) => {
            const mockGenially = { name: "mockGenially", description: "Description too long AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Description should have a maximum of 125 characters");
                    done();
                });
        });

        it("Should success adding a genially: HTTP 200", (done) => {
            const mockGenially = { name: "mockName", description: "mockDescription"};
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("_id");
                    expect(res.body).toHaveProperty("_name", mockGenially.name);
                    expect(res.body).toHaveProperty("_description", mockGenially.description);
                    expect(res.body).toHaveProperty("_createdAt");
                    done();
                });
        });
    });
    describe("Remove geniallys", () => {
        it("Should fail removing a genially with an empty id: HTTP 400", (done) => {
            const removedGenially = "";

            request(app).delete("/genially")
                .send({ id: removedGenially })
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Genially <> does no exist");
                    done();
                });
        });

        it("Should fail removing a genially without id: HTTP 400", (done) => {
            request(app).delete("/genially")
                .send({ })
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Genially <undefined> does no exist");
                    done();
                });
        });

        it("Should fail removing an genially when not exists: HTTP 400", (done) => {
            const removedGenially = "nonExistingGenially";

            request(app).delete("/genially")
                .send({ id: removedGenially })
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain(`Genially <${removedGenially}> does no exist`);
                    done();
                });
        });

        it("Should success removing an genially: HTTP 200", (done) => {
            const mockGenially = { name: "mockName", description: "mockDescription"};
            let addedGenially = null;
            //First we add a genially
            request(app)
                .post("/genially")
                .send(mockGenially)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("_id");
                    addedGenially = res.body._id;

                    request(app).delete("/genially")
                        .send({ id: addedGenially })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end((err, res) => {
                            if(err) throw err;
                            expect(res.body).not.toBe(null);
                            expect(res.body).toHaveProperty("status", "ok");
                            done();
                        });
                });
        });
    });
    describe("Rename geniallys", () => {
        it("Should fail renaming a genially not providing name: HTTP 400", (done) => {
            const renamedGenially = {
                id: "nonExistingGenially"
            };

            request(app)
                .patch("/genially")
                .send(renamedGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("A name should be provided");
                    done();
                });

        });

        it("Should fail renaming if id is not provided: HTTP 400", (done) => {
            const renamedGenially = {
                name: "newGeniallyName"
            };

            request(app)
                .patch("/genially")
                .send(renamedGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain("Genially <undefined> does no exist");
                    done();
                });
        });

        it("Should fail renaming a genially when not exists: HTTP 400", (done) => {
            const renamedGenially = {
                id: "nonExistingGenially",
                name: "newGeniallyName"
            };

            request(app)
                .patch("/genially")
                .send(renamedGenially)
                .expect("Content-Type", /json/)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("status", "ko");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toContain(`Genially <${renamedGenially.id}> does no exist`);
                    done();
                });
        });

        it("Should success renaming a genially: HTTP 200", (done) => {
            const firstGenially = { name: "testGenially", description: "testDescription" };
            const renamedGenially = { id: "", name: "newGeniallyName" };

            request(app)
                .post("/genially")
                .send(firstGenially)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("_id");
                    renamedGenially.id = res.body._id;
                    request(app)
                        .patch("/genially")
                        .send(renamedGenially)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end((err, res) => {
                            if(err) throw err;
                            expect(res.body).not.toBe(null);
                            expect(res.body).toHaveProperty("_id", renamedGenially.id);
                            expect(res.body).toHaveProperty("_name", renamedGenially.name);
                            expect(res.body).toHaveProperty("_modifiedAt");
                            done();
                        });
                });

        });

        it("Should fail renaming a genially with a name less than 3 characters: HTTP 400", (done) => {
            const firstGenially = { name: "testGenially", description: "testDescription" };
            const renamedGenially = { id: "", name: "ab" };

            request(app)
                .post("/genially")
                .send(firstGenially)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("_id");
                    renamedGenially.id = res.body._id;
                    request(app)
                        .patch("/genially")
                        .send(renamedGenially)
                        .expect("Content-Type", /json/)
                        .expect(400)
                        .end((err, res) => {
                            if(err) throw err;
                            expect(res.body).not.toBe(null);
                            expect(res.body).toHaveProperty("status", "ko");
                            expect(res.body).toHaveProperty("message");
                            expect(res.body.message).toContain("Name should have at least 3 characters");
                            done();
                        });
                });

        });

        it("Should fail renaming a genially with a name more than 25 characters: HTTP 400", (done) => {
            const firstGenially = { name: "testGenially", description: "testDescription" };
            const renamedGenially = { id: "", name: "NAME TOO LONG: AAAAAAAAAAAAAAAA" };
            request(app)
                .post("/genially")
                .send(firstGenially)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    if(err) throw err;
                    expect(res.body).not.toBe(null);
                    expect(res.body).toHaveProperty("_id");
                    renamedGenially.id = res.body._id;
                    request(app)
                        .patch("/genially")
                        .send(renamedGenially)
                        .expect("Content-Type", /json/)
                        .expect(400)
                        .end((err, res) => {
                            if(err) throw err;
                            expect(res.body).not.toBe(null);
                            expect(res.body).toHaveProperty("status", "ko");
                            expect(res.body).toHaveProperty("message");
                            expect(res.body.message).toContain("Name should have a maximum of 20 characters");
                            done();
                        });
                });
        });
    });
});
