import * as express from 'express'
export default express.Router()
        .get('/', (req, res) => res.send('There is something here I promise :)'))
