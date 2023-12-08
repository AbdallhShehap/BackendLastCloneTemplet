const dataDetails = require("../Module/allData"); 


// footerFirstTitle	footerSecoundTitle	footerThirdTitle	copyWriteText	


const adddetails = async (req, res) => {
    const {footerFirstTitle	,footerSecoundTitle	,footerThirdTitle	,copyWriteText ,textUnderInput	} = req.body;


    dataDetails.query(
        'INSERT INTO `footer` (`footerFirstTitle`, `footerSecoundTitle`,`footerThirdTitle`, `copyWriteText`, `textUnderInput`) VALUES (?,?,?,?,?)',
        [footerFirstTitle	,footerSecoundTitle	,footerThirdTitle	,copyWriteText ,textUnderInput],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'Details Footer added successfully' });
            }
        }
    );
}



const getdetailss = async (req, res) => {
    dataDetails.query('SELECT * FROM `footer` ', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getdetailsById = async (req, res) => {
    const id = req.params.id;
    dataDetails.query('SELECT * FROM `footer` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'footer not found' }); // If no results are found.
        }
      }
    });
  };
  
// years-experience	skilled	visited	number-projects	

const updatedetails = async (req, res) => {
    const id = req.params.id;
    const { footerFirstTitle	,footerSecoundTitle	,footerThirdTitle	,copyWriteText ,textUnderInput } = req.body;

    // Build the SET part of the SQL query dynamically based on provided fields
    let setClause = [];
    let queryParams = [];

    if (footerFirstTitle !== undefined) {
        setClause.push('`footerFirstTitle` = ?');
        queryParams.push(footerFirstTitle);
    }
    if (footerSecoundTitle !== undefined) {
        setClause.push('`footerSecoundTitle` = ?');
        queryParams.push(footerSecoundTitle);
    }
    if (footerThirdTitle !== undefined) {
        setClause.push('`footerThirdTitle` = ?');
        queryParams.push(footerThirdTitle);
    }
    if (copyWriteText !== undefined) {
        setClause.push('`copyWriteText` = ?');
        queryParams.push(copyWriteText);
    }
    if (textUnderInput !== undefined) {
        setClause.push('`textUnderInput` = ?');
        queryParams.push(textUnderInput);
    }
    if (setClause.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update' });
    }
    queryParams.push(parseInt(id, 10)); // Ensure id is an integer
    
    // Finalize the SQL query
    const sqlQuery = `UPDATE footer SET ${setClause.join(', ')} WHERE id = ?`;

    dataDetails.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Details not found or no new data to update' });
            } else {
                res.status(200).json({ message: 'Details updated successfully' });
            }
        }
    });
};

  



  const deletedetails = async (req, res) => {
    const id = req.params.id;
    dataDetails.query('DELETE FROM `footer` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Details deleted successfully' });
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


