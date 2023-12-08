const dataCategory = require("../Module/allData"); 


const addSidemenu = async (req, res) => {
  const { name, link } = req.body;

  // Correct the query by using two separate placeholders for name and link
  dataCategory.query(
      'INSERT INTO socialmediamain (`name`, `link`) VALUES (?, ?)',
      [name, link],
      (error, results) => {
          if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
          } else {
              res.status(200).json({ message: 'Side menu content details added successfully' });
          }
      }
  );
};




const getSidemenus = async (req, res) => {
    dataCategory.query('SELECT * FROM socialmediamain', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getSidemenuById = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM socialmediamain WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'socialmediamain not found' }); // If no results are found.
        }
      }
    });
  };
  


  const updateSidemenu = async (req, res) => {
    const id = req.params.id;
    const { name , link } = req.body;
  
    dataCategory.query(
      'UPDATE socialmediamain SET `name` = ? ,  `link` = ? WHERE `id` = ?',
      [name , link, parseInt(id, 10)], // Ensure id is an integer
      (error, results) => {
        if (error) {
          console.error(error); // Log the detailed error to the console.
          res.status(500).json({ error: 'Internal Server Error', message: error });
        } else {
          if (results.affectedRows === 0) {
            res.status(404).json({ message: 'socialmediamain not found or no new data to update' });
          } else {
            res.status(200).json({ message: 'Side menu content updated successfully' });
          }
        }
      }
    );
  };
  
  
  const deleteSidemenu = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM socialmediamain WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Side menu content deleted successfully' });
      }
    });
  };
  
  module.exports = {
    addSidemenu,
    getSidemenus,
    getSidemenuById,
    updateSidemenu,
    deleteSidemenu
  };


