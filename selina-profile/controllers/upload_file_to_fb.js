const response_data = require('../helpers/response')
const firebase = require('../helpers/firebase')
const axios = require('axios')

const upload_image = async(req, res, next) => {
    try {
        if(!req.file) {
            return res.json(
                response_data(
                    data = "no_file_founs", 
                    status_code = 4,
                    message = "Error: No files found"
                )
            )
        } 
    
        const image = firebase.bucket.file(req.file.originalname)
        const now = Date.now()
        image.name = String(now) + "_" + image.name
        const image_writer = image.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        })

        image_writer.on('error', (err) => {
            return res.json(
                response_data(
                    data = err, 
                    status_code = 4,
                    message = "Error"
                )
            )
        })
        
        await image_writer.on('finish', async () => {
            const image_data_on_fb = await axios.get(
                `https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/${image.name}`)
            const download_token = image_data_on_fb.data.downloadTokens
            res.json(response_data(
                data = {
                    url: `https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/${image.name}?alt=media&token=${download_token}`
                }
            ))
        })
        
        image_writer.end(req.file.buffer)
        console.log("done")
    }
    catch (err) {
        return res.json(response_data(data={}, status_code=4, message=err.message))
    }
}

module.exports = {
    upload_image
}