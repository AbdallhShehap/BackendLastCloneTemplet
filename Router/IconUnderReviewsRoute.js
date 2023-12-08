
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
  
  // Route to handle file upload
  router.post('/addreviewsicon', upload.single('iconunderreviews'), (req, res) => {

   

    let imagePath =  path.join('images', req.file.filename) ; // Set imagePath only if a file was uploaded
    
    let sql = 'INSERT INTO `icones-under-reviews` (';
    let placeholders = [];
    let values = [];

    if (imagePath) {
        sql += '`icon`';
        placeholders.push('?');
        values.push(imagePath); // Fixed: Use imagePath instead of image
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
      return res.status(200).json({ message: 'Our Benfits added successfully', path: imagePath });
    });
  });
  



  router.get('/reviewsicon', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM `icones-under-reviews`',  (error, results) => {
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
  


  router.get('/reviewsicon/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT * FROM `icones-under-reviews` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['icon'];
        // Assuming you're serving the 'images' folder statically with Express
        res.status(200).json({ imagePath: imagePath });
      } else {
        res.status(404).send('Icon not found.');
      }
    });
  });
  





  router.put('/reviewsicon/:id', upload.single('iconunderreviews'), (req, res) => {
    const id = req.params.id;
    
  
 
    const newImagePath = path.join('images', req.file.filename);
  
    // Update the database with the new image path
    dataCategory.query('UPDATE `icones-under-reviews` SET `icon` = ? WHERE `id` = ?', [newImagePath, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Icon updated successfully', newPath: newImagePath });
      } else {
        res.status(404).send('Icon not found for update.');
      }
    });
  });
  



  const fs = require('fs');

  router.delete('/reviewsicon/:id', async (req, res) => {
    const id = req.params.id;
  
    // First, get the current image path from the database
    dataCategory.query('SELECT `icon` FROM `icones-under-reviews` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['icon'];
  
        // Delete the image file
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete the image file.' });
          }
  
          // Delete the image path from the database
          dataCategory.query('DELETE FROM `icones-under-reviews` WHERE `id` = ?', [id], (error) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            }
            res.status(200).json({ message: 'Icon deleted successfully' });
          });
        });
      } else {
        res.status(404).send('Icon not found.');
      }
    });
  });
  









module.exports = router;