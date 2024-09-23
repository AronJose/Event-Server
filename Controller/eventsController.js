const Category = require("../Model/Events/Category/category");
const Services = require("../Model/Events/Services/service");
const Event = require("../Model/Events/Events");
const Providing = require("../Model/Events/providing/providing");
const Providers = require("../Model/Events/Providers/Providers");

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


const categoryById = async (req, res) => {
    try {
        if (!req.query.category_id) {
            return res.status(400).json({ "message": "ID is not Existed" });
        }
        const category = await Category.findById({ _id: req.query.category_id });
        if (category) {
            res.status(200).json({ category });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
// ------------------------------ Service List ----------------------------------------
const getServices = async (req, res) => {
    try {

        const services = await Services.find();
        res.json(services);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const serviceById = async (req, res) => {
    try {
        if (!req.query.service_id) {
            return res.status(400).json({ "message": "ID is not Found" });
        }
        const service = await Services.findById({ _id: req.query.service_id });
        if (service) {
            res.status(200).json(service);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

// ------------------------------------ Event Creation --------------------------------------------

const createEvent = async (req, res) => {
    try {
        const requiredFields = [
            "Event_name",
            "place",
            "desc",
            "address",
            "category",
            "email",
            "contact"
            // "services",
            // "providers",
            //hall ,part, like ....
            // "providing",
        ];

        for (const field of requiredFields) {
            if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === "")) {
                return res.status(400).json({ error: `${field} is a required field` });
            }
        }

        const eventCreation = {
            Event_name: req.body.Event_name,
            place: req.body.place,
            desc: req.body.desc,
            address: req.body.address,
            category: req.body.category,
            services: req.body.services,
            image: req.body.image,
            providing: req.body.providing,
            providers: req.body.providers,
            email: req.body.email,
            contact: req.body.contact
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

// -------------------------------------- Event List --------------------------------------------

const getEventList = async (req, res) => {
    try {
        const events = await Event.find({ status: 'active' });
        if (events.length > 0) {
            res.json(events);
        } else {
            res.status(404).json({ message: "No active events found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// --------------------------- Event Update -----------------------------------------------------


// -----------------------------Event Delete -----------------------------------------------------

const eventDelete = async (req, res) => {
    try {
        const { event_id } = req.query;

        if (!event_id) {
            return res.status(400).json({ message: "Event ID not provided" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event_id,
            { status: 'trash' }, // Set the status to 'trash' for soft delete
            { new: true } // Return the updated event
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
            message: "Event moved to trash successfully",
            event: updatedEvent
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
        const searchText = req.query.search || '';
        const category = req.query.category ? req.query.category.split(',') : [];
        const service = req.query.service ? req.query.service.split(',') : [];

        const matchQuery = {
            ...(searchText && {
                Event_name: {
                    $regex: searchText,
                    $options: 'i',
                }
            }),
            ...(category.length > 0 && {
                category: {
                    $in: category.map(cat => new RegExp(cat, 'i'))
                }
            }),
            ...(service.length > 0 && {
                services: {
                    $in: service.map(ser => new RegExp(ser, 'i'))
                }
            }),
            status: { $ne: 'trash' },
        };

        const aggregationPipeline = [
            {
                $match: matchQuery
            },
            {
                $sort: { Event_name: 1 },
            }
        ];

        const results = await Event.aggregate(aggregationPipeline).exec();
        console.log(results, "results")
        results.length > 0 ? res.status(200).json(results) : res.status(200).json({ message: "Data is Not Matched" });

    } catch (error) {
        console.error("Error searching events:", error);
        res.status(500).json({ error: error.message });
    }
};



// ----------------------------- Search sort in event list ------------------------------------------

const searchOrGetEventList = async (req, res) => {
    try {
        const searchText = req.query.search || '';
        const category = req.query.category ? req.query.category.split(',') : [];
        const service = req.query.service ? req.query.service.split(',') : [];

        const matchQuery = {
            ...(searchText && {
                Event_name: {
                    $regex: searchText,
                    $options: 'i',
                }
            }),
            ...(category.length > 0 && {
                category: {
                    $in: category.map(cat => new RegExp(cat, 'i'))
                }
            }),
            ...(service.length > 0 && {
                services: {
                    $in: service.map(ser => new RegExp(ser, 'i'))
                }
            }),
            status: { $ne: 'trash' },  // Default match for all active/non-trash events
        };

        // Check if any search parameters exist
        if (searchText || category.length > 0 || service.length > 0) {
            const aggregationPipeline = [
                { $match: matchQuery },
                { $sort: { Event_name: 1 } },
            ];

            const results = await Event.aggregate(aggregationPipeline).exec();
            return results.length > 0
                ? res.status(200).json(results)
                : res.status(200).json({ message: "Data is Not Matched" });
        } else {
            // If no search params are provided, return active events
            const events = await Event.find({ status: 'active' });
            return events.length > 0
                ? res.status(200).json(events)
                : res.status(404).json({ message: "No active events found" });
        }
    } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ------------------------------Add and Get Providings-----------------------------------

const addProvings = async (req, res) => {
    try {
        if (!req.body.providing || req.body.providing.trim() == "") {
            return res.status(400).json({ "message": "providing Name is required" })
        }
        else {
            const providings = new Providing({ providing: req.body.providing });

            const providingsData = await providings.save();

            if (providingsData) {
                res.status(200).json(providingsData);
            } else {
                res.status(400).json({ Error: 'Error in insert new record' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProvidings = async (req, res) => {
    try {
        const providingDatas = await Providing.find();
        if (providingDatas.length > 0) {
            res.json(providingDatas);
        } else {
            res.status(404).json({ message: "No active providingData found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// -------------------------------- Add and Get Providers ---------------------------------
const addProviders = async (req, res) => {
    try {
        if (!req.body.providers || req.body.providers.trim() == "") {
            return res.status(400).json({ "message": "providers Name is required" })
        }
        else {
            const providers = new Providers({ providers: req.body.providers });

            const providersData = await providers.save();

            if (providersData) {
                res.status(200).json(providersData);
            } else {
                res.status(400).json({ Error: 'Error in insert new record' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProviders = async (req, res) => {
    try {
        const providersData = await Providers.find();
        if (providersData.length > 0) {
            res.json(providersData);
        } else {
            res.status(404).json({ message: "No active providersData found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------------------------------------- Get Common API -----------------------------------

const getCommonApi = async (req, res) => {
    try {
        const [providersData, providingDatas, services, categoryList] = await Promise.all([
            Providers.find(),
            Providing.find(),
            Services.find(),
            Category.find()
        ]);

        if (providersData.length > 0 || providingDatas.length > 0 || services.length > 0 || categoryList.length > 0) {
            res.json({
                providersData,
                providingDatas,
                services,
                categoryList
            });
        } else {
            res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


const videoUpload = async (req, res) => {
    // try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file provided!' });
        }

        const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi'];
        if (!allowedVideoTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, message: 'Invalid video format!' });
        }

        res.status(200).json({
            success: true,
            message: 'Video uploaded successfully!',
            file: req.file
        });
    // } catch (error) {
    //     console.error("Error uploading video:", error);
    //     res.status(500).json({
    //         success: false,
    //         message: 'An error occurred during video upload.',
    //         error: error.message
    //     });
    // }
};





module.exports = {
    addCategory,
    categoryList,
    categoryById,
    addServices,
    getServices,
    serviceById,
    createEvent,
    getEventList,
    eventDelete,
    multipleImgUpload,
    searchEvent,
    searchOrGetEventList,
    addProvings,
    getProvidings,
    addProviders,
    getProviders,
    getCommonApi,
    videoUpload

}
