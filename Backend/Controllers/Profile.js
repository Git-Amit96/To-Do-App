const View = async (req, res) => {
    try {
        res.status(200).json({ status: "Success", profile: req.user });

    } catch (err) {
        res.status(500).send("Error Occured.");
    }
}


module.exports = { View};
