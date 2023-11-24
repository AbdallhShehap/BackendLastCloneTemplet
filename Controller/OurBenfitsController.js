const dataCategory = require("../Module/allData"); 


const addOurBenfitsContent = async (req, res) => {
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

const addOurBenfits = async (req, res) => {
    const {sectiontitile, sectionsubtitile } = req.body;

    dataCategory.query(
        'INSERT INTO ourbenefits (`section-titile`, `section-subtitile`) VALUES (?,?)',
        [sectiontitile, sectionsubtitile],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'Our Benfits title added successfully' });
            }
        }
    );
}

const getOurBenfitsContent = async (req, res) => {
    dataCategory.query('SELECT * FROM ourbenefitscontent', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };

const getOurBenfits = async (req, res) => {
    dataCategory.query('SELECT * FROM ourbenefits', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };
  
  const getOurBenfitsContentById = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM ourbenefitscontent WHERE `id-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Our Benfits not found' }); // If no results are found.
        }
      }
    });
  };

  const getOurBenfitsById = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM ourbenefits WHERE `id-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Our Benfits not found' }); // If no results are found.
        }
      }
    });
  };

  const updateOurBenfits = async (req, res) => {
    const id = req.params.id;
    const {sectiontitile, sectionsubtitile} = req.body;
  
    dataCategory.query(
      'UPDATE ourbenefits SET `section-titile` = ?, `section-subtitile` = ? WHERE `id-ourbenefits` = ?',
      [sectiontitile, sectionsubtitile, parseInt(id, 10)], // Ensure id is an integer
      (error, results) => {
        if (error) {
          console.error(error); // Log the detailed error to the console.
          res.status(500).json({ error: 'Internal Server Error', message: error });
        } else {
          if (results.affectedRows === 0) {
            res.status(404).json({ message: 'OurBenfits not found or no new data to update' });
          } else {
            res.status(200).json({ message: 'Side menu updated successfully' });
          }
        }
      }
    );
  };

  const updateOurBenfitsContent = async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
  
    dataCategory.query(
      'UPDATE ourbenefitscontent SET `title` = ?, `content` = ? WHERE `id-ourbenefits` = ?', 
     

      [title, content, parseInt(id, 10)],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        } else {
          if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Our benefits content not found or no new data to update' });
          } else {
            res.status(200).json({ message: 'Our benefits content updated successfully' });
          }
        }
      }
    );
  };
  
    
  const deleteOurBenfitsContent = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM ourbenefitscontent WHERE `id-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'our benefits deleted successfully' });
      }
    });
  };

  const deleteOurBenfits = async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM ourbenefits WHERE `id-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'our benefits deleted successfully' });
      }
    });
  };

  
  module.exports = {
    addOurBenfits,addOurBenfitsContent,
    getOurBenfits,getOurBenfitsContent,
    getOurBenfitsById,getOurBenfitsContentById,
    updateOurBenfits,updateOurBenfitsContent,
    deleteOurBenfits,deleteOurBenfitsContent
  };

