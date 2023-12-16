
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
  router.post('/addreviewsslide', upload.single('imgreviewsslide'), (req, res) => {

    const { name, job, content} = req.body;

    let imagePath =  path.join('images', req.file.filename) ; // Set imagePath only if a file was uploaded
    
    let sql = 'INSERT INTO reviews (';
    let placeholders = [];
    let values = [];

    if (imagePath) {
        sql += '`image`';
        placeholders.push('?');
        values.push(imagePath); // Fixed: Use imagePath instead of image
      }
      

    
    if (name) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`name`';
      placeholders.push('?');
      values.push(name);
    }


    if (job) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`job`';
      placeholders.push('?');
      values.push(job);
    }


    if (content) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`content`';
      placeholders.push('?');
      values.push(content);
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
      // Retrieve the ID of the newly inserted review
      const newReviewId = results.insertId;

      // You might want to retrieve the full review data here
      // For simplicity, we're only returning the ID
      return res.status(200).json({ 
          message: 'Review added successfully', 
          id: newReviewId, // Include the new review ID in the response
          imagePath: imagePath,
          name: name,
          job: job,
          content: content });
    });
  });
  



  router.get('/reviewsslide', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM reviews',  (error, results) => {
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
  


  router.get('/reviewsslide/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT * FROM reviews WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['imgSection'];
        // Assuming you're serving the 'images' folder statically with Express
        res.status(200).json({ imagePath: imagePath });
      } else {
        res.status(404).send('Image not found.');
      }
    });
  });
  





  router.put('/reviewsslide/:id', upload.single('imgreviewsslide'), (req, res) => {
    const id = req.params.id;
    const { name, job, content} = req.body;
  
    let newImagePath;
    if (req.file) {
      newImagePath = path.join('images', req.file.filename);
    }
  
  
    // Update the database with the new image path
    dataCategory.query('UPDATE reviews SET `image` = ? , `name` = ?  , `job` = ? , `content` = ? WHERE `id` = ?', [newImagePath,  name, job, content, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Image updated successfully', newPath: newImagePath });
      } else {
        res.status(404).send('Image not found for update.');
      }
    });
  });
  



  const fs = require('fs');

  router.delete('/reviewsslide/:id', async (req, res) => {
    const id = req.params.id;
  
    // First, get the current image path from the database
    dataCategory.query('SELECT `image` FROM reviews WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['image'];
  
        // Delete the image file
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete the image file.' });
          }
  
          // Delete the image path from the database
          dataCategory.query('DELETE FROM reviews WHERE `id` = ?', [id], (error) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            }
            res.status(200).json({ message: 'Image deleted successfully' });
          });
        });
      } else {
        res.status(404).send('Image not found.');
      }
    });
  });
  









module.exports = router;