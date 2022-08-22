import mongoose, {Schema, model} from 'mongoose'

const mensajeSchema = new Schema ({
    mensaje:{
            type: String,
            required:[true, 'El mensaje es requerido']
    },
    remitente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required:["El remitente es requerido",true]
    },
    destinatario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required:["El destinatario es requerido",true]
    },
    deshabilitado:{
        type:Boolean,
        required:true,
        default: false
    },
},
{
    timestamps: true,
    versionKey: false,
}
)


export default model('Mensaje',mensajeSchema)