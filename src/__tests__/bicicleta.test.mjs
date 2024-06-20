import supertest from 'supertest';
import { app } from '../index.mjs';
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const validToken = jwt.sign({ id: process.env.TOKEN_ID }, process.env.TOKEN_SECRET ); 


let server

beforeAll((done) => {
    const PORT = 3005;
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



describe("/bicicleta Route", () => {
    describe("GET /bicicleta/todas", () => {
        it("should return a list of bicicletas", async () => {
            const response = await supertest(server)
            .get("/api/v1/bicicleta/todas")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        codigo_bicicleta: expect.any(Number),
                        quadro_bicicleta: expect.any(Number),
                        cor_bicicleta: expect.any(String),
                        created_at: expect.any(String),
                        updated_at: expect.any(String)
                    })
                ])
            )
        })      
    })


    describe("POST /bicicleta with missing data", () => {
        it("should create a new bicicleta", async () => {
            const response = await supertest(server)
            .post("/api/v1/bicicleta")
            .set('Authorization', validToken)
            .send({
                quadro_bicicleta: 16,
            })
            .expect('Content-Type', /json/)
            .expect(400)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: expect.arrayContaining([
                        expect.objectContaining({
                            type: expect.any(String),
                            msg: expect.any(String),
                            path: expect.any(String),
                            location: expect.any(String)
                        })
                    ])
                })
            )
        })
    })

    describe("POST /bicicleta necessary data", () => {
        it("should create a new bicicleta", async () => {
            const response = await supertest(server)
            .post("/api/v1/bicicleta")
            .set('Authorization', validToken)
            .send({
                quadro_bicicleta: 16,
                cor_bicicleta: "azul"
            })
            .expect('Content-Type', /json/)
            .expect(201)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        codigo_bicicleta: expect.any(Number),
                        quadro_bicicleta: expect.any(Number),
                        cor_bicicleta: expect.any(String),
                        created_at: expect.any(String),
                        updated_at: expect.any(String)
                    })
                })
            )
        })
    })

    describe("GET /bicicleta/:id with existing ID", () => {
        it("should return bicicleta data", async () => {
            const response = await supertest(server)
            .get("/api/v1/bicicleta/20")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        codigo_bicicleta: 20,
                        quadro_bicicleta: expect.any(Number),
                        cor_bicicleta: expect.any(String),
                        created_at: expect.any(String),
                        updated_at: expect.any(String)
                    })
                })
            )
        })
    })

    describe("GET /bicicleta/:id with non-existing ID", () => {
        it("should return 404 bicicleta not found", async () => {
            const response = await supertest(server)
            .get("/api/v1/bicicleta/9999")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(404)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: "Bicicleta not found"
                })
            )
        })
    })


    describe("GET /bicicleta/:id with invalid ID", () => {
        it("should return 400 Invalid ID", async () => {
            const response = await supertest(server)
            .get("/api/v1/bicicleta/abc")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(400)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: "Invalid ID"
                })
            )
        })
    })

})