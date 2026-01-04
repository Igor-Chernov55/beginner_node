import express, { Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from './types';
import { SamuraiViewModel } from './models/SamuraiViewModel';
import { GetSamuraiParamsModel } from './models/GetSamuraiParamsModel';
import { CreateSamuraiModel } from './models/CreateSamuraiModel';
import { UpdateSamuraiModel } from './models/UpdateSamuraiModel';
import { DeleteSamuraiModel } from './models/DeleteSamuraiModel';
import { HttpStatusCode } from './enums';

export const app = express();
const port = 3000;

// Root Route: GET request to http://localhost:3000/

const middlwareJson = express.json();

app.use(middlwareJson);

let db: SamuraiViewModel[] = [{id: 1, name: 'Samurai'}, {id: 2, name: 'Ninja'}, {id: 3, name: 'Shinobi'}]

app.get('/', (req, res: Response<SamuraiViewModel[]>) => {
    res.json(db)
});

app.get('/findSamurai/:id', (req: RequestWithParams<GetSamuraiParamsModel>, res: Response<SamuraiViewModel>) => {
    if (req.params.id && db.find(samurai => samurai.id === +req.params.id)) {
        res.json(db.find(samurai => samurai.id === +req.params.id));
    }
    else {
        res.sendStatus(HttpStatusCode.NotFound_404)
        return
    }
});

app.post('/createSamurai', (req: RequestWithBody<CreateSamuraiModel>, res: Response<SamuraiViewModel>) => {
    if (!req.body.name || !req.body.id) {
        res.sendStatus(HttpStatusCode.BadRequest_400);
        return
    }

    else {
        const newSamurai = {
            id: req.body.id,
            name: req.body.name
        }
        db.push(newSamurai);

        res.status(HttpStatusCode.Created_201).json(newSamurai)
    }

});

app.put('/updateSamurai', (req: RequestWithBody<UpdateSamuraiModel>, res) => {
    if (!req.body.name) {
        res.sendStatus(HttpStatusCode.BadRequest_400);
        return
    }

    if (!db.find(value => value.id == +req.body.id)) {
        res.sendStatus(HttpStatusCode.NotFound_404)
        return
    }

    else {
        db = [...db, {id: req.body.id, name: req.body.name}]
        res.status(HttpStatusCode.OK_200).send({message: 'Samurai updated successfully', samurai: req.body.name});
        return
    }

});

app.delete('/killSamurai', (req: RequestWithBody<DeleteSamuraiModel>, res: Response<SamuraiViewModel>) => {
    if (!req.body.name) {
        res.sendStatus(HttpStatusCode.BadRequest_400);
        return
    }

    if (!db.find(value => value.id == +req.body.id)) {
        res.sendStatus(HttpStatusCode.NotFound_404)
        return
    }

    else {
        db = db.filter(value => value.id != +req.body.id)
        res.json({name: req.body.name, id: req.body.id});
    }
});

app.delete('/killAllSamurais', (req, res) => {
    db = []
    res.status(HttpStatusCode.NoContent_204).send({message: 'All Samurais deleted successfully'});
})

// Start the serverhttp://localhost:3000/samurais
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
