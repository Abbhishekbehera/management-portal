import multer from "multer"
import path from 'path'
import fs from 'fs'

const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

function fileFilter(req, file, cb) {
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only Excel files are allowed"));
    }
}

export const upload = multer({ storage, fileFilter })

