const dataDetails = require("../Module/allData"); 



const adddetails = async (req, res) => {
    const {title ,description } = req.body;


    dataDetails.query(
        'INSERT INTO `about-blogs` (`title`, `description`) VALUES (?,?)',
        [title ,description],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'Details blog added successfully' });
            }
        }
    );
}



const getdetailss = async (req, res) => {
    dataDetails.query('SELECT * FROM `about-blogs` ', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getdetailsById = async (req, res) => {
    const id = req.params.id;
    dataDetails.query('SELECT * FROM `about-blogs` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'details not found' }); // If no results are found.
        }
      }
    });
  };
  
// years-experience	skilled	visited	number-projects	

const updatedetails = async (req, res) => {
    const id = req.params.id;
    const { title ,description } = req.body;

    // Build the SET part of the SQL query dynamically based on provided fields
    let setClause = [];
    let queryParams = [];
    if (title !== undefined) {
        setClause.push('`title` = ?');
        queryParams.push(title);
    }
    if (description !== undefined) {
        setClause.push('`description` = ?');
        queryParams.push(description);
    }
   
    if (setClause.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update' });
    }
    queryParams.push(parseInt(id, 10)); // Ensure id is an integer
    
    // Finalize the SQL query
    const sqlQuery = `UPDATE \`about-blogs\` SET ${setClause.join(', ')} WHERE id = ?`;

    dataDetails.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'blogs not found or no new data to update' });
            } else {
                res.status(200).json({ message: 'blogs updated successfully' });
            }
        }
    });
};

  



  const deletedetails = async (req, res) => {
    const id = req.params.id;
    dataDetails.query('DELETE FROM `about-blogs` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'blogs deleted successfully' });
      }
    });
  };
  
  module.exports = {
    adddetails,
    getdetailss,
    getdetailsById,
    updatedetails,
    deletedetails
  };


