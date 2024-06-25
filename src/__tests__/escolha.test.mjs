import supertest from 'supertest';
import { app } from '../index.mjs';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const validToken = jwt.sign({ id: process.env.TOKEN_ID }, process.env.TOKEN_SECRET ); 


let server

beforeAll((done) => {
    const PORT = 3007;
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



describe("/escolha Route", () => {
    describe("GET /escolha/todas", () => {
        it("should return a list of escolha", async () => {
            const response = await supertest(server)
            .get("/api/v1/escolha/todas")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        codigo_escolha: expect.any(Number),
                        data_escolha: expect.any(String),
                        codigo_interessado: expect.any(Number),
                        codigos_bicicletas: expect.any(Array),
                        data_escolha: expect.any(String),
                    })
                ])
            )
        })      
    })

    describe("GET /escolha/:id with existing ID", () => {
        it("should return escolha data", async () => {
            const response = await supertest(server)
            .get("/api/v1/escolha/1")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        codigo_escolha: 1,
                        codigos_bicicletas: expect.any(Array),
                        codigo_interessado: expect.any(Number),
                        data_escolha: expect.any(String),
                    })
                })
            )
        })
    })

    describe("GET /escolha/:id with non-existing ID", () => {
        it("should return 404 escolha not found", async () => {
            const response = await supertest(server)
            .get("/api/v1/escolha/9999")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(404)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: "Escolha not found"
                })
            )
        })
    })


    describe("GET /escolha/:id with invalid ID", () => {
        it("should return 400 Invalid ID", async () => {
            const response = await supertest(server)
            .get("/api/v1/escolha/abc")
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



    describe("Given there are all sizes of quadro in bicicletas data", () => {
        describe("POST /escolha with client 150cm", () => {
            it("should create escolha with bicicleta_quadro 14", async () => {
                const response = await supertest(server)
                .post("/api/v1/escolha")
                .set('Authorization', validToken)
                .send({ codigo_interessado: 3 })
                .expect('Content-Type', /json/)
                .expect(201)



                expect(response.body).toEqual(
                    expect.objectContaining({
                        data: expect.objectContaining({
                            codigo_escolha: expect.any(Number),
                            codigo_interessado: 3,
                            codigos_bicicletas: expect.any(Array),
                            data_escolha: expect.any(String),
                            quadro_bicicleta: 14
                        })
                    })
                )
            })
        })



        describe("POST /escolha with client 190cm", () => {
            it("should create escolha with bicieta_quadro 17", async () => {
                const response = await supertest(server)
                .post("/api/v1/escolha")
                .set('Authorization', validToken)
                .send({ codigo_interessado: 2 })
                .expect('Content-Type', /json/)
                .expect(201)

                expect(response.body).toEqual(
                    expect.objectContaining({
                        data: expect.objectContaining({
                            codigo_escolha: expect.any(Number),
                            codigo_interessado: 2,
                            codigos_bicicletas: expect.any(Array),
                            data_escolha: expect.any(String),
                            quadro_bicicleta: 17
                        })
                    })
                )
            })
        })


        describe("POST /escolha with client 165cm", () => {
            it("should create escolha with bicicleta_quadro 16", async () => {
                const response = await supertest(server)
                .post("/api/v1/escolha")
                .set('Authorization', validToken)
                .send({ codigo_interessado: 1 })
                .expect('Content-Type', /json/)
                .expect(201)

                expect(response.body).toEqual(
                    expect.objectContaining({
                        data: expect.objectContaining({
                            codigo_escolha: expect.any(Number),
                            codigo_interessado: 1,
                            codigos_bicicletas: expect.any(Array),
                            data_escolha: expect.any(String),
                            quadro_bicicleta: 16
                        })
                    })
                )
            })
        })



    })

})