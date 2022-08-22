import {Schema, model} from 'mongoose'

const usuarioSchema = new Schema ({
    nickname:{
        type: String,
        required:["Es NickName es requerido",true],
        min: 3,
        max: 20,
        unique: true
    },
    email:{
        type: String,
        required:["El E-mail es requerido",true],
        unique : true,
        min: 3,
        max: 50
    },
    password:{
        type:String,
        required:["La contraseña es requerida",true],
        min: 8,
        max: 20
    },
    avatar:{
        type:String,
        default:"assets/images/avatar-predeterminado.png"

    },
    chat:[ {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: false,
    }],
    perfil:{
        type: Schema.Types.ObjectId,
        ref: "Perfil",
        required: false
    },
    estatus:{
        type: Boolean,
        required: true,
        default: false
    },
    deshabilitado:{
        type:Boolean,
        required:true,
        default: false
    }
},{
    timestamps: true,
    versionKey: false,

})


export default model('Usuario', usuarioSchema)