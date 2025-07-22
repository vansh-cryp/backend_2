import multer from "multer";
//use to take photos from the user
const storage = multer.diskStorage({
    //cb is callback
  destination: function (req, file, cb) {
    cb(null, "./public/temp") // location where all files will be saved
  },
  filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

export const upload = multer({
    storage,
})