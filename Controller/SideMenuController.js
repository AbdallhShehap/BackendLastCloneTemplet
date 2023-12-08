const dataCategory = require("../Module/allData"); 


const addSidemenu = async (req, res) => {
    const { titlesidemenu, subtitle1sidemenu, subtitle2sidemenu, textsidemenu, placeHolderInput } = req.body;

    dataCategory.query(
        'INSERT INTO sidemenu (`titlesidemenu`, `subtitle1sidemenu`, `subtitle2sidemenu`, `textsidemenu`, `placeHolderInput`) VALUES (?,?,?,?,?)',
        [titlesidemenu, subtitle1sidemenu, subtitle2sidemenu, textsidemenu, placeHolderInput],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'Side menu details added successfully' });
            }
        }
    );
}



const getSidemenus = async (req, res) => {
    dataCategory.query('SELECT * FROM sidemenu', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getSidemenuById = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM sidemenu WHERE `id-side-menu` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Sidemenu not found' }); // If no results are found.
        }
      }
    });
  };
  


  const updateSidemenu = async (req, res) => {
    const id = req.params.id;
    const { titlesidemenu, subtitle1sidemenu, subtitle2sidemenu, textsidemenu, placeHolderInput } = req.body;
  
    dataCategory.query(
      'UPDATE sidemenu SET `titlesidemenu` = ?, `subtitle1sidemenu` = ?, `subtitle2sidemenu` = ?, `textsidemenu` = ? , `placeHolderInput` = ? WHERE `id-side-menu` = ?',
      [titlesidemenu, subtitle1sidemenu, subtitle2sidemenu, textsidemenu, placeHolderInput , parseInt(id, 10)], // Ensure id is an integer
      (error, results) => {
        if (error) {
          console.error(error); // Log the detailed error to the console.
          res.status(500).json({ error: 'Internal Server Error', message: error });
        } else {
          if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Sidemenu not found or no new data to update' });
          } else {
            res.status(200).json({ message: 'Side menu updated successfully' });
          }
        }
      }
    );
  };
  
  
  const deleteSidemenu = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM sidemenu WHERE `id-side-menu` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Side menu deleted successfully' });
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


