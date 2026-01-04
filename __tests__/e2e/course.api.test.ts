import request from 'supertest';
import {app} from "../../src";
import {HttpStatusCode} from "../../src/enums";
import {SamuraiViewModel} from "../../src/models/SamuraiViewModel";
import {CreateSamuraiModel} from "../../src/models/CreateSamuraiModel";
import {DeleteSamuraiModel} from "../../src/models/DeleteSamuraiModel";

describe('Course API', () => {

    beforeAll( async () => {
        await request(app).delete('/killAllSamurais').expect(HttpStatusCode.NoContent_204);
    })

    it('should return db', async () => {
        await request(app).get('/').expect(HttpStatusCode.OK_200, []);
    });

    it('should return error find user', async () => {
        await request(app).get('/findSamurai/22').expect(HttpStatusCode.NotFound_404);
    });

    it('should not create user', async () => {
        const data: CreateSamuraiModel = {name: 'Sama'} as CreateSamuraiModel; // Intentional missing id
        await request(app).post('/createSamurai').send(data).expect(HttpStatusCode.BadRequest_400);

        await request(app).get('/').expect(HttpStatusCode.OK_200, []);
    });

    it('should create user', async () => {
       const data: CreateSamuraiModel = {name: 'Ninja', id: 2};
       const responseCreateSamurai = await request(app)
           .post('/createSamurai')
           .send(data)
           .expect(HttpStatusCode.Created_201);

        const res: SamuraiViewModel = responseCreateSamurai.body


       expect(res).toEqual({
           name: expect.any(String),
           id: expect.any(Number),
       })

        await request(app).get('/').expect(HttpStatusCode.OK_200, [res]);
    });

    it('should remove user', async () => {
      const data: DeleteSamuraiModel = {id: 2, name: 'Ninja'};
      const responseDelete = await request(app)
          .delete('/killSamurai')
          .send(data)
          .expect(HttpStatusCode.OK_200);

      const res: SamuraiViewModel = responseDelete.body

      expect(res).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
      })

        await request(app).get('/findSamurai/2').expect(HttpStatusCode.NotFound_404);

    });
});
