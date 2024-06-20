import supertest from 'supertest';
import { app } from '../index.mjs';
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

const validToken = jwt.sign({ id: process.env.TOKEN_ID }, process.env.TOKEN_SECRET ); 
const invalidToken = jwt.sign({ id: process.env.TOKEN_ID}, "invalidSecret");

let server

beforeAll((done) => {
    const PORT = 3003;
    server = app.listen(PORT, () => {
        console.log('Test server running on port ' + PORT);
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});


describe("/auth Route", () => {
    describe("Acess Endpoint without valid token", () => {
        it("should return error", async () => {
            const response = await supertest(server)
            .get("/api/v1/auth/status")
            .set('Authorization', invalidToken)
            .expect(500)
            .expect('Content-Type', /json/)
            //.catch(err => console.error(err));



            expect(response.body).toEqual(
                expect.objectContaining({
                    error: expect.any(Object)
                })
            );  
        })
    })
    describe("GET /status with valid token", () => {
        it("should return token id", async () => {
            const response = await supertest(server)
            .get("/api/v1/auth/status")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    status: true,
                    data: expect.objectContaining({
                        tokenId: expect.any(String)
                    })
                })
            );
        })
    })

})
