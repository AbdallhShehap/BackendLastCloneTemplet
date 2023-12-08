const express = require('express');
const router = express.Router();



const multer = require('multer');
const path = require('path');
const dataCategory = require('../Module/allData'); // Make sure this is the correct path to your database module

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', 'images'));
    },
    filename: function(req, file, cb) {
        // Prepend the current timestamp to the original file name
        const uniquePrefix = Date.now() + '-';
        cb(null, uniquePrefix + file.originalname);
      }
      
  });
  
  const upload = multer({ storage: storage });


  router.post('/add', upload.single('imagefirstmarquee'), (req, res) => {
    const { titlefirstmarquee } = req.body; // Get the title from the request body, could be undefined
    let imagePath = req.file ? path.join('images', req.file.filename) : null; // Set imagePath only if a file was uploaded
    
    // Construct the SQL query dynamically based on what data is provided
    let sql = 'INSERT INTO firstmarquee (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`imageFirstMarqueePath`';
      placeholders.push('?');
      values.push(imagePath);
    
      if (titlefirstmarquee) {
        sql += ', '; // Add a comma only if there was also an image
      }
    }


  if (titlefirstmarquee) {
  sql += '`title-first-marquee`';
  placeholders.push('?');
  values.push(titlefirstmarquee);
}
    
    if (placeholders.length === 0) {
      return res.status(400).send('No data provided.');
    }
  
    sql += ') VALUES (' + placeholders.join(', ') + ')';
  
    // Execute the SQL query with the values
    dataCategory.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({ message: 'First Marquee added successfully', path: imagePath, title: titlefirstmarquee });
    });
  });
  


  // Route to retrieve 
  router.get('/firstmarquee', async (req, res) => {
    
  
    dataCategory.query('SELECT * FROM `firstmarquee`', (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).send('Entry not found.');
      }
    });
  });
  



  // Route to retrieve a specific entry by ID
router.get('/firstmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `image-first-marquee-path`, `title-first-marquee` FROM firstmarquee WHERE `id-first-marquee` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send('Entry not found.');
      }
    });
  });
  

// Route to update an entry by ID
router.put('/firstmarquee/:id', upload.single('imagefirstmarquee'), (req, res) => {
    const id = req.params.id;
    const { titlefirstmarquee } = req.body; // Get the title from the request body
    const newImagePath = req.file ? path.join('images', req.file.filename) : undefined;
  
    // Update the database entry
    dataCategory.query('UPDATE firstmarquee SET `image-first-marquee-path` = ?, `title-first-marquee` = ? WHERE `id-first-marquee` = ?', [newImagePath, titlefirstmarquee, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'First Marquee updated successfully', newPath: newImagePath, title: titlefirstmarquee });
      } else {
        res.status(404).send('Entry not found for update.');
      }
    });
  });
  


  const fs = require('fs');

  router.delete('/firstmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    // Get the current image path from the database
    dataCategory.query('SELECT `image-first-marquee-path` FROM firstmarquee WHERE `id-first-marquee` = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }

        if (results.length === 0) {
            return res.status(404).send('Entry not found.');
        }

        const imagePath = results[0]['image-first-marquee-path'];
  
        // Function to delete the database record
        const deleteRecord = () => {
            dataCategory.query('DELETE FROM firstmarquee WHERE `id-first-marquee` = ?', [id], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
                }
                res.status(200).json({ message: 'First Marquee deleted successfully' });
            });
        };
  
        // If there's an image path, try to delete the image file
        if (imagePath) {
            fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
                if (err) {
                    console.error(err);
                    // Even if image deletion fails, proceed to delete database record
                }
                // Proceed to delete the database record whether or not the image file was successfully deleted
                deleteRecord();
            });
        } else {
            // If there is no image path, just delete the database record
            deleteRecord();
        }
    });
});





module.exports = router;