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


  router.post('/addsocialiconfooter', upload.single('socialiconfooter'), (req, res) => {
    const { link, name } = req.body;
    let imagePath = req.file ? path.join('images', req.file.filename) : null;

    let sql = 'INSERT INTO `social-icon-footer` (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`icon`';
      placeholders.push('?');
      values.push(imagePath);
    }

    if (link) {
      if (imagePath) sql += ', '; // Add comma if there was an image
      sql += '`link`';
      placeholders.push('?');
      values.push(link);
    }

    if (name) {
      if (imagePath || link) sql += ', '; // Add comma if there was an image or link
      sql += '`name`';
      placeholders.push('?');
      values.push(name);
    }
    
    if (placeholders.length === 0) {
      return res.status(400).send('No data provided.');
    }

    sql += ') VALUES (' + placeholders.join(', ') + ')';

    dataCategory.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({ message: 'Social icon added successfully', path: imagePath, title: link });
    });
});



  // Route to retrieve 
  router.get('/socialiconfooter', async (req, res) => {
    
  
    dataCategory.query('SELECT * FROM `social-icon-footer` ', (error, results) => {
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
router.get('/socialiconfooter/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `icon`, `link` FROM `social-icon-footer`  WHERE `id` = ?', [id], (error, results) => {
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
router.put('/socialiconfooter/:id', upload.single('socialiconfooter'), (req, res) => {
  const id = req.params.id;
  const { link, name  } = req.body;

  let updateQuery = 'UPDATE `social-icon-footer` SET ';
  let updateValues = [];
  
  if (req.file) {
    const newImagePath = path.join('images', req.file.filename);
    updateQuery += '`icon` = ?';
    updateValues.push(newImagePath);
  }

  if (name) {
    if (updateValues.length > 0) {
      updateQuery += ', ';
    }
    updateQuery += '`name` = ?';
    updateValues.push(name);
  }

  if (link) {
    if (updateValues.length > 0) {
      updateQuery += ', ';
    }
    updateQuery += '`link` = ?';
    updateValues.push(link);
  }

  updateQuery += ' WHERE `id` = ?';
  updateValues.push(id);

  dataCategory.query(updateQuery, updateValues, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'icon footer updated successfully', newPath: req.file ? req.file.filename : 'No new image uploaded', name: name });
    } else {
      res.status(404).send('Entry not found for update.');
    }
  });
});


  const fs = require('fs');

  router.delete('/socialiconfooter/:id', async (req, res) => {
    const id = req.params.id;
  
    // Get the current image path from the database
    dataCategory.query('SELECT `icon` FROM `social-icon-footer` WHERE `id` = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }

        if (results.length === 0) {
            return res.status(404).send('Entry not found.');
        }

        const imagePath = results[0]['icon'];
  
        // Function to delete the database record
        const deleteRecord = () => {
            dataCategory.query('DELETE FROM `social-icon-footer` WHERE `id` = ?', [id], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
                }
                res.status(200).json({ message: 'Details deleted successfully' });
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