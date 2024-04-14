import {Router} from "express";
import { checkSchema } from "express-validator";
import { exampleRouteValidation } from "../utils/validationSchemas.mjs";
import { matchedData,validationResult } from "express-validator";
import { handleError } from "../utils/helpers.mjs";
const router = Router();


//example POST route using express-validator validation
router.post('/example', checkSchema(exampleRouteValidation), (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return handleError(res, result.array());
    }
    const data = matchedData(req);
    const { example } = data;

    res.status(200).send({"msg": "Example route", "data": example});
})
// ----------------------------


export default router