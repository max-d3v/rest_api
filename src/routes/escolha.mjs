import {Router} from "express";
import { checkSchema } from "express-validator";
import { matchedData,validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { CreateEscolhaValidation } from "../utils/validationSchemas.mjs";

const prisma = new PrismaClient();
const router = Router();


router.get('/todas', async (req, res) => {
    const response = await prisma.escolha.findMany()
    try {
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }

    try {
        const response = await prisma.escolha.findUnique({
            where: {
                codigo_escolha: parseInt(id)
            }
        })
        if (response == null) {
            res.status(404).send({"error": "Escolha not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});




router.post('/', checkSchema(CreateEscolhaValidation),  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("passou aqui");
        return res.status(400).send({"error": result.array()});
    }
    const data = matchedData(req);
    const { codigo_interessado } = data;

    try {
    const interessado = await prisma.interessado.findUnique({
        where: {
            codigo_interessado: codigo_interessado
        }
    })

    if (!interessado) {
        return res.status(404).send({"error": "Interessado not found"});
    }

    var selectedQuadro = null;
    const { altura_interessado_cm } = interessado;
    if (!altura_interessado_cm) {
        return res.status(400).send({"error": "Altura do interessado não informada"});
    }
    
    if (altura_interessado_cm >= 150 && altura_interessado_cm <= 160 ) {
        selectedQuadro = 14;
    }
    else if (altura_interessado_cm > 160 && altura_interessado_cm <= 170 ) {
        selectedQuadro = 16;
    }
    else if ( altura_interessado_cm > 170 ) {
        selectedQuadro = 17;
    }

    if (!selectedQuadro) {
        return res.status(400).send({"error": "Erro ao calcular altura do quadro"});
    }

    const selectedBicicleta = await prisma.bicicleta.findFirst({
        where: {
            quadro_bicicleta: selectedQuadro
        }
    })
    if (!selectedBicicleta) {
        return res.status(404).send({"error": "Bicicleta com aro desejado não encontrada"});
    }

    const {codigo_bicicleta} = selectedBicicleta;

    
        var escolha = await prisma.escolha.create({
            data: {
                codigo_bicicleta,
                codigo_interessado,
            }
        })
        escolha.quadro_bicicleta = selectedQuadro;


        res.status(201).send({"data": escolha});
    }
    catch(err) {
        res.status(500).send({"error": err});
    }
})








export default router