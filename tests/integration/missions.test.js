const request= require('supertest');
const {Mission}= require('../../model/mission');
let server;

describe('/api/missions',()=>{
    beforeEach(()=>{
        server=require('../../index');
        jest.setTimeout(100000);
    });
    afterEach(async ()=>{
        server.close();
        await Mission.deleteMany();
    });
    describe('GET /',()=>{
        it('should return all the missions',async()=>{
            await Mission.collection.insertMany([
                {details:'Je suis'},
                {details:'Je ne suis pas'}
            ]);
            const res= await request(server).get('/api/missions');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m=> m.details==='Je suis')).toBeTruthy();
            
        });
    });
});