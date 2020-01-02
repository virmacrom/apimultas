const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
    dni: String,
    puntos: Number,
    name: String

});

multaSchema.methods.cleanup = function(){
    return {dni: this.dni, puntos: this.puntos, name: this.name};
}
const Multa =mongoose.model('Multa', multaSchema);

module.exports = Multa;