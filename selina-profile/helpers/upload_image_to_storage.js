const response_data = require('./response')
const firebase = require('./firebase')
const axios = require('axios')

const upload_image = async (file) => {
    try {
        return new Promise((resolve, reject) => {
            if(!file) {
                return resolve(response_data(
                    data = "no_file_found", 
                    status_code = 4,
                    message = "Error: No files found"
                ))
            }
        
            const image = firebase.bucket.file(file.originalname)
            const now = Date.now()
            image.name = String(now) + "_" + image.name
            const image_writer = image.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            })
    
            image_writer.on('error', (err) => {
                return resolve(response_data(
                    data = err, 
                    status_code = 4,
                    message = "Error"
                ))
            })
                    
            image_writer.on('finish', async () => {
                const image_data_on_fb = await axios.get(
                    `https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/${image.name}`)
                const download_token = image_data_on_fb.data.downloadTokens
    
                return resolve(response_data(
                    data = {
                        url: `https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/${image.name}?alt=media&token=${download_token}`
                    }
                ))
            })
    
            image_writer.end(file.buffer)
        })
        
    }
    catch (err) {
        console.log(err)
        return resolve(response_data(data={}, status_code=4, message=err.message))
    }
}

module.exports = upload_image