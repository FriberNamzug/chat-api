import fs from 'fs'
import util from 'util'

const errorLog = (error,res) => {

    res.status(500).json({
        message: "Ocurrio un error en el servidor",
        error:error,
    })
    console.log(`Ocurrio un error en el servidor: ${error})`)

    fs.writeFileSync('./logs/error.log', util.inspect(error, { showHidden: false, depth: null }), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    }
    )
}

export default errorLog