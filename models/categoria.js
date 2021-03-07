const { Schema, model } = require('mongoose');


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio para su registro'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.method('toJSON', function() {
    const { __v, _id, estado, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Categoria', CategoriaSchema);