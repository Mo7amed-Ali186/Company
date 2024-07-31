import express from 'express'
import * as dotenv from'dotenv'
import path  from 'path';
import { bootstrap } from './src/bootstrap.js'
const app = express()
dotenv.config({path:path.resolve('./config/.env')})
const port = +process.env.PORT;
bootstrap(app,express)

app.listen(port, () => console.log(`company listening on port ${port}!`))