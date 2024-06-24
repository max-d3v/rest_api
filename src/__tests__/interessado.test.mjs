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
    const PORT = 3006;
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



describe("/interessado Route", () => {
    describe("GET /interessado/todos", () => {
        it("should return a list of interessados", async () => {
            const response = await supertest(server)
            .get("/api/v1/interessado/todos")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        codigo_interessado: expect.any(Number),
                        nome_interessado: expect.any(String),
                        fone_interessado: expect.any(String),
                        email_interessado: expect.any(String),
                        altura_interessado_cm: expect.any(Number)
                    })
                ])
            )
        })      
    })


    describe("POST /interessado with missing data", () => {
        it("should return validation Errors", async () => {
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

    describe("POST /interessado with necessary data", () => {
        it("should create a new interessado", async () => {
            const response = await supertest(server)
            .post("/api/v1/interessado")
            .set('Authorization', validToken)
            .send({
                nome_interessado: 16,
                fone_interessado: "azul",
                email_interessado: "email@interessadoTeste.com",
                altura_interessado_cm: 180
            })
            .expect('Content-Type', /json/)
            .expect(201)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        codigo_interessado: expect.any(Number),
                        nome_interessado: expect.any(String),
                        fone_interessado: expect.any(String),
                        email_interessado: expect.any(String),
                        altura_interessado_cm: expect.any(Number)
                    })
                })
            )
        })
    })

    describe("GET /interessado/:id with existing ID", () => {
        it("should return interessado data", async () => {
            const response = await supertest(server)
            .get("/api/v1/bicicleta/1")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        codigo_interessado: expect.any(Number),
                        nome_interessado: expect.any(String),
                        fone_interessado: expect.any(String),
                        email_interessado: expect.any(String),
                        altura_interessado_cm: expect.any(Number)
                    })
                })
            )
        })
    })

    describe("GET /interessado/:id with non-existing ID", () => {
        it("should return 404 interessado not found", async () => {
            const response = await supertest(server)
            .get("/api/v1/interessado/9999")
            .set('Authorization', validToken)
            .expect('Content-Type', /json/)
            .expect(404)
            //.catch(err => console.error(err));

            expect(response.body).toEqual(
                expect.objectContaining({
                    error: "Interessado not found"
                })
            )
        })
    })


    describe("GET /interessado/:id with invalid ID", () => {
        it("should return 400 Invalid ID", async () => {
            const response = await supertest(server)
            .get("/api/v1/interessado/abc")
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
    });

    describe("PATCH /interessado", () => {
        describe("With invalid ID", () => {
            it("should return Error invalid ID", async () => {
                const response = await supertest(server)
                .patch("/api/v1/interessado/asd")
                .set('Authorization', validToken)
                .send({
                    nome_interessado: "nome",
                    email_interessado: "email2@interessado.com",
                    fone_interessado: "fone",
                    altura_interessado_cm: 180
                })
                .expect('Content-Type', /json/)
                .expect(400)
                
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: "Invalid ID"
                    })
                )
            })
        })
        describe("With invalid data", () => {
            it("Should return validation Error", async () => {
                const response = await supertest(server)
                .patch("/api/v1/interessado/1")
                .set('Authorization', validToken)
                .send({
                    email_interessado: 123123
                })
                .expect('Content-Type', /json/)
                .expect(400)
                
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

        describe("With non-existing interessado", () => {
            it("should return 404 interessado not found", async () => {
                const response = await supertest(server)
                .patch("/api/v1/interessado/999999")
                .set('Authorization', validToken)
                .send({
                    nome_interessado: "nome",
                    email_interessado: "xana@lixo.fdp",
                    fone_interessado: "fone",
                    altura_interessado_cm: 180
                })
                .expect('Content-Type', /json/)
                .expect(404)

                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: "Interessado not found"
                    })
                )

            })
        })

        describe("all valid data", () => {
            it("should return updated interessado", async () => {
                const response = await supertest(server)
                .patch("/api/v1/interessado/20")
                .set('Authorization', validToken)
                .send({
                    nome_interessado: "nome",
                    email_interessado: "email@email.com",
                    fone_interessado: "fone",
                    altura_interessado_cm: 180
                })
                .expect('Content-Type', /json/)
                .expect(200)

                expect(response.body).toEqual(
                    expect.objectContaining({
                        data: expect.objectContaining({
                            codigo_interessado: expect.any(Number),
                            nome_interessado: expect.any(String),
                            fone_interessado: expect.any(String),
                            email_interessado: expect.any(String),
                            altura_interessado_cm: expect.any(Number)
                        })
                    })
                )
            })
        })
    })

})