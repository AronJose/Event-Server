const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); //set all types of extension available
        cb(null, file.fieldname + '-' + Date.now() + fileExtension); // Set filename 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/; // Allow images and video formats
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and videos are allowed!')); // Reject file
    }
};


const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Middleware for single file upload
const singleUpload = upload.single('image');

// Middleware for multiple files upload
const multipleUpload = upload.array('images', 8); // Limit to 10 files 

// Middleware for single video upload
const singleVideoUpload = upload.single('video');

// Middleware for multiple video uploads (limit to 5 files)
const multipleVideoUpload = upload.array('videos', 5);

module.exports = {
    singleUpload,
    multipleUpload, 
    singleVideoUpload,
    multipleVideoUpload
};
