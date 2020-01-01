const app = require('../server.js');
//const db = require('../db.js');
const Multa = require ('../multas.js');
const request = require('supertest');


// describe("test - Hola mundo", () => {
//     it("test básico de prueba", () =>{
//         const a = 9;
//         const b = 8;
//         const sum = a+b;

//         expect (sum).toBe(17);

//     });
// });

describe("Multas API", () =>{
    describe("GET /", () => {
        it("Debería devolver un documento HTML", () => {

            return request (app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });

    describe("GET /multas", () =>{

        beforeAll(() =>{
            const multas =[
                new Multa({"DNI":"123456", "puntos": "5", "name":"Exceso de velocidad"}),
                new Multa({"DNI":"789012", "puntos": "0", "name":"atropello"})
            ];
            dbFind = jest.spyOn(Multa,"find");
            dbFind.mockImplementation((query, callback) =>{
                callback(null,multas);
            });
        });

        it("Debe devolver todas las multas", () =>{
            return request(app).get('/api/v1/multas').then((response)=> {
                expect(response.statusCode).toBe(200);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    describe("POST /multas", async() =>{
        
        const multa ={dni:"918274", puntos: "10", name:"alcohol", rango: "200+"};
        let dbInsert;
        
        beforeEach(()=>{
            dbInsert = jest.spyOn(Multa, "create");
        });

        it('Test para añadir una nueva multa', () =>{
            
            dbInsert.mockImplementation((c, callback) =>{
                callback(false);
            });
            return request(app).post('/api/v1/multas').send(multa).then((response)=> {
                expect (response.statusCode).toBe(201);
                expect (dbInsert).toBeCalledWith(multa, expect.any(Function));
                
            });
        });

        it('Devolvemos mensaje 500 si hay algún problema con la Base de Datos', () => {
            dbInsert.mockImplementation((c, callback) =>{
                callback(true)
            });
            
            
        });
        return request(app).post('/api/v1/multas').send(multa).then((response)=> {
            expect (response.statusCode).toBe(500);
            
        });
    });
});