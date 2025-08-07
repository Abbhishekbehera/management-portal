import multer from "multer";
import path from 'path'

const storage = multer.memoryStorage()

const fileFilter=(req,file,cb)=>{
    const ext=path.extname(file.originalname)
    if(ext!=='.xlsx' && ext!='xls'){
        return cb(new Error('Only Excel files are allowed'),false) 
    }
    cb(null,true)
}

export const upload=multer({storage,fileFilter})

// controller call....multer csv files should be deleted after saving in  data db