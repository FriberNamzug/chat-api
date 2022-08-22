import multer from 'multer'
import fs from 'fs'


export const upload = (req, res, next) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callbalck) {
                try {
                    const { nickname } = req.user
                    const path = `./public/images/users/${nickname}/`

                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path, { recursive: true })
                        callbalck(null, path);
                    }
                    callbalck(null, path)

                } catch (error) {
                    return console.log(error)
                }
            },
            filename: function (req, file, callbalck) {
                try {
                    const { nickname } = req.user

                    const extension = file.originalname.split(".")[1]

                    const fileName = `avatar-de-${nickname}.${extension}`

                    callbalck(null, fileName)

                } catch (error) {
                    return console.log(error)
                }
            }
        }),
        fileFilter: (req, file, callbalck) => {
            const acceptFile = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/jpg"]

            if (acceptFile.includes(file.mimetype)) {
                callbalck(null, true)
            } else {
                callbalck(new Error("El archivo no es una imagen"), false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
            fields: 1,
            files: 1,
            parts: 2,
            headerParts: 1,
            headerFields: 1,
        }

    }).single('avatar');

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: err.message })
        } else if (err) {
            return res.status(500).json({ error: err.message })
        }

        next()
    })
}
