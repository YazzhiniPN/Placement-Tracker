const Application = require("../models/Application");

async function personalStats(req,res){
    try {
        const stats = await Application.aggregate([
            {
                $match: {user: req.user.id}
            },
            {
                $group: {
                    _id: "$status",
                    count: {$sum: 1}
                }
            }
        ]);

        const byType = await Application.aggregate([
            {
                $match: {user: req.user.id}
            },
            {
                $group: {
                    _id: "$type",
                    count: {$sum: 1}
                }
            }
        ]);

        return res.json({bystatus: stats, byType});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

module.exports = {personalStats}