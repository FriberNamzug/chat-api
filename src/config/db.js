import mongoose from "mongoose"

const database = () => {
    mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(db => console.log('Se ha conectado a la db'))
    .catch(error => console.log('No se ha conectado' + error))
}

export default database;