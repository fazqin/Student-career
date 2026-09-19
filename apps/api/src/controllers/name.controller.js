const getNameById = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const names = [
        {id: 1, name: "Faza"}, 
        {id: 2, name: "Budi"}, 
        {id: 3, name: "Andi"}

    ];

    const name = names.find((item) => item.id === id);
    if (name) {
        res.json(name);
    } else {
        res.status(404).json({
            error: "Name Not Found"
        });
    }
};

module.exports = {
    getNameById
};