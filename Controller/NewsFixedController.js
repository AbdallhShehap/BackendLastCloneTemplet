const dataCategory = require("../Module/allData"); 


const addFixedNews = async (req, res) => {
  const { title1, title2, buttonName, buttonLink } = req.body;

  // Correct the query by enclosing the table name in backticks
  dataCategory.query(
      'INSERT INTO `news-fixed` (`title1`, `title2`, `buttonName`, `buttonLink`) VALUES (?, ?, ?, ?)',
      [title1, title2, buttonName, buttonLink],
      (error, results) => {
          if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
          } else {
              res.status(200).json({ message: 'Fixed News content details added successfully' });
          }
      }
  );
};




const getFixedNewss = async (req, res) => {
    dataCategory.query('SELECT * FROM `news-fixed`', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getFixedNewsById = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM `news-fixed` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Fixed News not found' }); // If no results are found.
        }
      }
    });
  };
  

  const updateFixedNews = async (req, res) => {
    const id = req.params.id;
    const { title1, title2, buttonName, buttonLink } = req.body;

    dataCategory.query(
        'UPDATE `news-fixed` SET `title1` = ?, `title2` = ?, `buttonName` = ?, `buttonLink` = ? WHERE `id` = ?',
        [title1, title2, buttonName, buttonLink, parseInt(id, 10)], // Ensure id is an integer
        (error, results) => {
            if (error) {
                console.error(error); // Log the detailed error to the console.
                res.status(500).json({ error: 'Internal Server Error', message: error });
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'news-fixed not found or no new data to update' });
                } else {
                    res.status(200).json({ message: 'Fixed News content updated successfully' });
                }
            }
        }
    );
};

  
  
  const deleteFixedNews = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM `news-fixed` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Fixed News content deleted successfully' });
      }
    });
  };
  
  module.exports = {
    addFixedNews,
    getFixedNewss,
    getFixedNewsById,
    updateFixedNews,
    deleteFixedNews
  };


