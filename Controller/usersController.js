const users = require('../Model/Users');
const session = require('../Model/sessions');
const Event = require('../Model/Events/Events');
var jwt = require("jsonwebtoken")
const HashPassword = require("../Helper/password").HashPassword;
const verifyHashPassword = require("../Helper/password").verifyHashPassword

// -------------------------------- Sign Up __--------------------------------------------
const addUser = async (req, res) => {
    try {
        const requiredFields = [
            "first_name",
            "last_name",
            "email",
            "contact",
            // "role",
            "password"
        ];
        for (const field of requiredFields) {
            if (!req.body[field] || req.body[field].trim() === "") {
                return res.status(400).json({ error: `${field} is a required field` });
            }
        }
        const hashedPassword = HashPassword(req.body.password);

        const image = req.file ? `uploads/${req.file.filename}` : null;

        const createdUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact: req.body.contact,
            // role: req.body.role,
            image: image ? image : null,
            password: hashedPassword.hash,
            password_salt: hashedPassword.salt
        }
        const userdata = new users(createdUser)
        let saved = await userdata.save()
        if (saved) {
            res.status(200).json({ message: "success", saved: saved });
        } else {
            res.status(400).json({ Error: 'Error in inserting a new record' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -----------------------------Users List ---------------------------------------------

const getUsers = async (req, res) => {
    try {
        const usersList = await users.find();
        res.json(usersList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ------------------------------ Login _----------------------------------------------------

const login = async (req, res) => {
    try {
        const requiredFields = ["email", "password"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required`, code: 400 });
            }
        }
        const userData = await users.findOne({ email: req.body.email });
        if (userData) {
            const isPasswordValid = await verifyHashPassword(req.body.password, userData.password_salt);
            if (isPasswordValid.hash === userData.password) {
                const tokenPayload = {
                    _id: userData._id,
                    // role: userData.role
                };
                const token = jwt.sign(tokenPayload, "secretkey", { expiresIn: 86400 });

                const createdToken = {
                    token: token,
                    user_id: userData._id,
                }
                const SessionData = new session(createdToken)
                let saved = await SessionData.save()
                if (saved) {
                    res.status(200).json({
                        message: "success",
                        userDetails: {
                            _id: userData._id,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            email: userData.email,
                            // role: userData.role,
                            token: token
                        }
                    });
                } else {
                    res.status(400).json({ Error: 'Error in Login data' });
                }

            } else {
                return res.status(401).json({ message: "Authentication failed" });
            }
        } else {
            return res.status(404).json({ message: "User does not exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ------------------------- Logout -------------------------------------------------------

const logout = async (req, res) => {
    // try {
        if (req && req.user && req.user._id && req.header('Authorization')) {
            const secssionRemove = await session.findOneAndDelete({ user_id: req.user._id, token: req.header('Authorization') });
            res.status(200).json({ secssionRemove })
            console.log(secssionRemove,"sessionnnnnnnnn");
        }
        else {
            res.status(400).json({ error: "Error occured in logout" });
        }
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
};

// -------------------- Profile Image upload -------------------------------------------------------

const imgUpload = async (req, res) => {
    try {
        if (req.file) {
            const { filename } = req.file;
            const filepath = `uploads/${filename}`;
            res.status(200).json({ message: 'File uploaded successfully.', filepath });
        } else {
            res.status(400).json({ error: "Failed to upload image." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error uploading file.' });
    }
};

// ----------------- Profile ------------------------------------------------------------------------

const profile = async (req, res) => {
    try {
        const profileData = await users.find().lean().populate({
            path: '_id',
            model: 'events',
            foreignField: 'user_id',
            localField: '_id',
        });
        res.status(200).json({
            message: "success",
            profileData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addUser,
    getUsers,
    login,
    logout,
    imgUpload,
    profile
}


