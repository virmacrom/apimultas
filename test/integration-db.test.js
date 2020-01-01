const Multa = require ('../multas');
const mongoose = require ('mongoose');
const dbConnect = require ('../db');

describe('Multas DB connection', () =>{
    beforeAll(() =>{
        return dbConnect();
    });

    beforeEach((done) =>{
        Multa.deleteMany({}, (err) =>{
            done();
        });
    });

    it ('writes a multas in the DB', (done)=>{
        const multa = new Multa({dni:'12345678A', puntos:'3', name:'alcohol'});
        multa.save((err, multa) =>{
            expect(err).toBeNull();
            Multa.find({}, (err, multas)=>{
                expect(multas).toBeArrayOfSize(1);
                done();
            });
        });
    }, 30000);

    afterAll((done) =>{
        mongoose.connection.db.dropDatabase(()=>{
            mongoose.connection.close(done);
        });
    });
});