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


  router.post('/add', upload.single('imagesecoundmarquee'), (req, res) => {
    const {titlesecoundmarquee } = req.body; // Get the title from the request body, could be undefined
    let imagePath = req.file ? path.join('images', req.file.filename) : null; // Set imagePath only if a file was uploaded
    
    // Construct the SQL query dynamically based on what data is provided
    let sql = 'INSERT INTO secoundmarquee (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`imageSecoundMarqueePath`';
      placeholders.push('?');
      values.push(imagePath);
    }
  
    if (titlesecoundmarquee) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`title-secound-marquee`';
      placeholders.push('?');
      values.push(titlesecoundmarquee);
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
      return res.status(200).json({ message: 'secound Marquee added successfully', path: imagePath, title: titlesecoundmarquee });
    });
  });
  


  // Route to retrieve 
  router.get('/secoundmarquee', async (req, res) => {
    
  
    dataCategory.query('SELECT * FROM `secoundmarquee`', (error, results) => {
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
router.get('/secoundmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `imageSecoundMarqueePath`, `title-secound-marquee` FROM secoundmarquee WHERE `id-secound-marquee` = ?', [id], (error, results) => {
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
router.put('/secoundmarquee/:id', upload.single('imagesecoundmarquee'), (req, res) => {
    const id = req.params.id;
    const { titlesecoundmarquee } = req.body; // Get the title from the request body
    const newImagePath = req.file ? path.join('images', req.file.filename) : undefined;
  
    // Update the database entry
    dataCategory.query('UPDATE secoundmarquee SET `imageSecoundMarqueePath` = ?, `title-secound-marquee` = ? WHERE `id-secound-marquee` = ?', [newImagePath, titlesecoundmarquee, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'secound Marquee updated successfully', newPath: newImagePath, title: titlesecoundmarquee });
      } else {
        res.status(404).send('Entry not found for update.');
      }
    });
  });
  


  const fs = require('fs');

  router.delete('/secoundmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    // Get the current image path from the database
    dataCategory.query('SELECT `imageSecoundMarqueePath` FROM secoundmarquee WHERE `id-secound-marquee` = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }

        if (results.length === 0) {
            return res.status(404).send('Entry not found.');
        }

        const imagePath = results[0]['imageSecoundMarqueePath'];
  
        // Function to delete the database record
        const deleteRecord = () => {
            dataCategory.query('DELETE FROM secoundmarquee WHERE `id-secound-marquee` = ?', [id], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
                }
                res.status(200).json({ message: 'secound Marquee deleted successfully' });
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