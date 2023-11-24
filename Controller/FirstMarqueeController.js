const dataCategory = require("../Module/allData"); 


const addFirstMarquee = async (req, res) => {
    const { title, content } = req.body;

    dataCategory.query(
        'INSERT INTO  ourbenefitscontent (`title`, `content`) VALUES (?,?)',
        [ title, content],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'Our Benfits content added successfully' });
            }
        }
    );
}




module.exports = {
    addFirstMarquee
  };