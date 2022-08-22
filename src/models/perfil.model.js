import mongoose, { Schema, model } from 'mongoose'

const perfilSchema = new Schema({
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
)


export default model('Perfil', perfilSchema)