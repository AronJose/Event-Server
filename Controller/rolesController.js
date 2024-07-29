const rolesModal = require('../Model/roles');

const addRoles = async (req, res) => {
    try {
        if (!req.body.role_name || req.body.role_name.trim() == "") {
            return res.status(400).json({ "message": "Role Name is required" })
        }
        else {
            const Role = new rolesModal({ role_name: req.body.role_name });

            const createdRole = await Role.save();

            if (createdRole) {
                res.status(200).json(createdRole);
            } else {
                res.status(400).json({ Error: 'Error in insert new record' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const rollList = await rolesModal.find();
        res.json(rollList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const createIndex = async (req, res) => {
//     try {
//         const result = await rolesModal.createIndexes({ role_name: -1 });

//         const results = await rolesModal.listIndexes();
//         console.log(results);
//         res.status(200).json({ results });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const RoleById = async (req,res)=>{
    try{
        const SinglRole = await rolesModal.findById({_id:req.query.role_id});
        res.status(200).json(SinglRole);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}




module.exports = {
    addRoles,
    getRoles,
    RoleById,
    // createIndex
};
