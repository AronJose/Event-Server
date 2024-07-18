const Category = require("../Model/Events/Category/category");
const Services = require("../Model/Events/Services/service");
const Event = require("../Model/Events/Events")

// -------------------------Category ----------------------------------------
const addCategory = async (req, res) => {
    try {
        if (!req.body.category_name || req.body.category_name.trim() == "") {
            return res.status(400).json({ "message": "categories Name is required" })
        }
        else {
            const categories = new Category({ category_name: req.body.category_name });

            const categoryData = await categories.save();

            if (categoryData) {
                res.status(200).json(categoryData);
            } else {
                res.status(400).json({ Error: 'Error in insert new record' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const categoryList = async (req, res) => {
    try {
        const categoryList = await Category.find();
        res.json(categoryList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ------------------------------- Services ----------------------------------------------

const addServices = async (req, res) => {
    try {
        if (!req.body.services || req.body.services.trim() == "") {
            return res.status(400).json({ "message": "services Name is required" })
        }
        else {
            const service = new Services({ services: req.body.services });

            const serviceData = await service.save();

            if (serviceData) {
                res.status(200).json(serviceData);
            } else {
                res.status(400).json({ Error: 'Error in insert new record' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ------------------------------------ Event Creation --------------------------------------------

const createEvent = async (req, res) => {
    try {
        const requiredFields = [
            "Event_name",
            "place",
            "desc",
            "address",
            "category",
            "services"
        ];

        for (const field of requiredFields) {
            if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === "")) {
                return res.status(400).json({ error: `${field} is a required field` });
            }
        }

        // Validate and convert category and services IDs
        const categoryIds = req.body.category;
        const serviceIds = req.body.services;

        const validCategories = await Category.find({ _id: { $in: categoryIds } });
        const validServices = await Services.find({ _id: { $in: serviceIds } });

        if (validCategories.length !== categoryIds.length) {
            return res.status(400).json({ error: "Some categories are invalid" });
        }

        if (validServices.length !== serviceIds.length) {
            return res.status(400).json({ error: "Some services are invalid" });
        }

        const eventCreation = {
            Event_name: req.body.Event_name,
            place: req.body.place,
            desc: req.body.desc,
            address: req.body.address,
            category: Array.from(new Set(validCategories.map(cat => cat._id))),
            services: Array.from(new Set(validServices.map(serv => serv._id))),
            image: req.body.image
        };

        const eventsData = new Event(eventCreation);
        let saved = await eventsData.save();

        if (saved) {
            res.status(200).json({ message: "success", saved: saved });
        } else {
            res.status(400).json({ error: 'Error in inserting new record' });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ------------------------ Multiple Image Upload --------------------------------------------------

const multipleImgUpload = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            const filepaths = req.files.map(file => `uploads/${file.filename}`);
            res.status(200).json({ message: 'Files uploaded successfully.', filepaths });
        } else {
            res.status(400).json({ error: "Failed to upload images." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error uploading files.' });
    }
};

// ------------------------- search -------------------------------------------------------------

const searchEvent = async (req, res) => {
    try {
        const searchText = req.query.search;
        const aggregationPipeline = [
            {
                $match: {
                    Event_name: {
                        $regex: searchText,
                        $options: "i"
                    }
                }
            },
            {
                $sort: { Event_name: 1 } // Sorting by Event_name in ascending order
            }
        ];

        // Execute aggregation query
        const results = await Event.aggregate(aggregationPipeline).exec();
        res.json(results);
    } catch (error) {
        console.error("Error searching events:", error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addCategory,
    categoryList,
    addServices,
    createEvent,
    multipleImgUpload,
    searchEvent
}
