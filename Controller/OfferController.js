// id	main-title-section	title-section	link	title-blog	blog-content	


const dataOffer = require("../Module/allData"); 



const addOffer = async (req, res) => {
    const { mainTitleSection, titleSection, link, titleBlog1 , blogContent1 ,titleBlog2 , blogContent2 ,titleBlog3 , blogContent3 ,titleBlog4 , blogContent4} = req.body;


    dataOffer.query(
        'INSERT INTO offer (`main-title-section`, `title-section`, `link`, `title-blog1` , `blog-content1`, `title-blog2` , `blog-content2`, `title-blog3` , `blog-content3` , `title-blog4` , `blog-content4`) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [mainTitleSection, titleSection, link, titleBlog1 , blogContent1 ,titleBlog2 , blogContent2 ,titleBlog3 , blogContent3 ,titleBlog4 , blogContent4],
        (error, results) => { // Changed 'res' to 'results' to prevent overwriting
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            } else {
                res.status(200).json({ message: 'offer added successfully' });
            }
        }
    );
}



const getOffers = async (req, res) => {
    dataOffer.query('SELECT * FROM offer', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    });
  };


  
  const getOfferById = async (req, res) => {
    const id = req.params.id;
    dataOffer.query('SELECT * FROM offer WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Offer not found' }); // If no results are found.
        }
      }
    });
  };
  
// years-experience	skilled	visited	number-projects	

// id	main-title-section	title-section	link	title-blog	blog-content	

const updateOffer = async (req, res) => {
    const id = req.params.id;
    const { mainTitleSection, titleSection, link, titleBlog1, blogContent1, titleBlog2, blogContent2, titleBlog3, blogContent3, titleBlog4, blogContent4 } = req.body;
  
    let setClause = [];
    let queryParams = [];
  
    if (mainTitleSection !== undefined) {
      setClause.push('`main-title-section` = ?');
      queryParams.push(mainTitleSection);
    }
    if (titleSection !== undefined) {
      setClause.push('`title-section` = ?');
      queryParams.push(titleSection);
    }
    if (link !== undefined) {
      setClause.push('`link` = ?');
      queryParams.push(link);
    }
    if (titleBlog1 !== undefined) {
      setClause.push('`title-blog1` = ?');
      queryParams.push(titleBlog1);
    }
    if (blogContent1 !== undefined) {
      setClause.push('`blog-content1` = ?');
      queryParams.push(blogContent1);
    }
    if (titleBlog2 !== undefined) {
      setClause.push('`title-blog2` = ?');
      queryParams.push(titleBlog2);
    }
    if (blogContent2 !== undefined) {
      setClause.push('`blog-content2` = ?');
      queryParams.push(blogContent2);
    }
    if (titleBlog3 !== undefined) {
      setClause.push('`title-blog3` = ?');
      queryParams.push(titleBlog3);
    }
    if (blogContent3 !== undefined) {
      setClause.push('`blog-content3` = ?');
      queryParams.push(blogContent3);
    }
    if (titleBlog4 !== undefined) {
      setClause.push('`title-blog4` = ?');
      queryParams.push(titleBlog4);
    }
    if (blogContent4 !== undefined) {
      setClause.push('`blog-content4` = ?');
      queryParams.push(blogContent4);
    }
  
    if (setClause.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }
  
    queryParams.push(parseInt(id, 10)); // Ensure id is an integer
  
    const sqlQuery = `UPDATE offer SET ${setClause.join(', ')} WHERE id = ?`;
  
    dataOffer.query(sqlQuery, queryParams, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Offer not found or no new data to update' });
        } else {
          res.status(200).json({ message: 'Offer updated successfully' });
        }
      }
    });
  };
  
  



  const deleteOffer = async (req, res) => {
    const id = req.params.id;
    dataOffer.query('DELETE FROM offer WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'offer deleted successfully' });
      }
    });
  };
  
  module.exports = {
    addOffer,
    getOffers,
    getOfferById,
    updateOffer,
    deleteOffer
  };


