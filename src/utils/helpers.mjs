//helper functions
export const handleError = (res, err, errCode = 401) => {
    res.status(errCode).json({ error: err });
}
// ------------------------------