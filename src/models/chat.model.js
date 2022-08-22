import mongoose, {Schema, model} from 'mongoose'

const chatSchema = new Schema ({
    nombre:{
        type: String,
        required: false,
    },
    miembros:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required:["Es requerido que tenga al menos un miembro",true]
    }],
    mensajes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mensaje',
        required: false
    }],
    deshabilitado:{
        type:Boolean,
        required:true,
        default: false
    }
},
{
    timestamps: true,
    versionKey: false,
}
)


export default model('Chat',chatSchema)