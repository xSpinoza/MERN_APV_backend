import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import routerVet from './routes/vetRoutes.js';
import routerPatient from './routes/patientRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const domains = [process.env.FRONTEND_URL],

      corsOptions = {
        origin: function(origin, callback){
            if(domains.indexOf(origin) !== -1){
                // The origin of the request is allow
                callback(null, true);
            } else{
                callback(new Error('Not allow for CORS'));
            }
        }
      }

app.use(cors(corsOptions));

app.use('/api/vets', routerVet);
app.use('/api/patients', routerPatient);

const PORT = process.env.PORT || 4000;
app.listen(PORT);