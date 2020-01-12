const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
    dni: String,
    concepto: String,
    puntos: Number,
    importe: Number

});

multaSchema.methods.cleanup = function(){
    return {_id: this._id, dni: this.dni, concepto: this.concepto, puntos: this.puntos, importe: this.importe};
}

const Multa =mongoose.model('Multa', multaSchema);

module.exports = Multa;