const multer = require('multer');
const fs = require('fs');
const {v4: uuidv4} = require('uuid')

//PRODUCT IMAGES--------------------------------------------------------------------------
const storage = multer.diskStorage({
        destination: (req,file,callback) => {
            callback(null, 'public/assets/img/store')
        },
        filename: (req,file,callback) => {
            const fileExt = file.originalname.split('.').slice(-1)[0]
            const fileName = `${uuidv4()}.${fileExt}`
            req.body.image = fileName
            callback(null, fileName)
        }
})

const uploadMulter = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.split('/')[0] === 'image') {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
})

const uploadProduct = uploadMulter.single('image')
//----------------------------------------------------------------------------------------


//USER IMAGES-----------------------------------------------------------------------------

const storageUser = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null, 'public/assets/img/avatar')
    },
    filename: (req,file,callback) => {
        const fileExt = file.originalname.split('.').slice(-1)[0]
        const fileName = `${uuidv4()}.${fileExt}`
        req.body.image = fileName
        callback(null, fileName)
    }
})

const uploadMulterUser = multer({
    storage: storageUser,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.split('/')[0] === 'image') {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
})

const uploadUserAvatar = uploadMulterUser.single('image')
//------------------------------------------------------------------------------------------


module.exports = {
    uploadProduct,
    uploadUserAvatar
}