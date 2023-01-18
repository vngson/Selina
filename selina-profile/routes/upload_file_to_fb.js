const router = require('express').Router()
const multer = require('multer')

const { upload_image } = require("../controllers/upload_file_to_fb")

const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/upload", upload.single('file'), upload_image)

module.exports = router