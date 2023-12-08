
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
  router.post('/addnewsslide', upload.single('imgnewsslide'), (req, res) => {

    const { date, title, subtitle , link} = req.body;

    let imagePath =  path.join('images', req.file.filename) ; // Set imagePath only if a file was uploaded
    
    let sql = 'INSERT INTO `news-slider` (';
    let placeholders = [];
    let values = [];

    if (imagePath) {
        sql += '`imageSrc`';
        placeholders.push('?');
        values.push(imagePath); // Fixed: Use imagePath instead of image
      }
      

    
    if (date) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`date`';
      placeholders.push('?');
      values.push(date);
    }


    if (title) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`title`';
      placeholders.push('?');
      values.push(title);
    }


    if (subtitle) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`subtitle`';
      placeholders.push('?');
      values.push(subtitle);
    }

    if (link) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`link`';
      placeholders.push('?');
      values.push(link);
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
      return res.status(200).json({ message: 'News Slider added successfully', results: results });
    });
  });
  



  router.get('/newsslide', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM `news-slider`',  (error, results) => {
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
  


  router.get('/newsslide/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT * FROM `news-slider` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['imageSrc'];
        // Assuming you're serving the 'images' folder statically with Express
        res.status(200).json({ results });
      } else {
        res.status(404).send('Image not found.');
      }
    });
  });
  





  router.put('/newsslide/:id', upload.single('imgnewsslide'), (req, res) => {
    const id = req.params.id;
    const { date, title, subtitle , link} = req.body;
  
 
    const newImagePath = path.join('images', req.file.filename);
  
    // Update the database with the new image path
    dataCategory.query('UPDATE `news-slider` SET `imageSrc` = ? , `date` = ?  , `title` = ? , `subtitle` = ? , `link` = ? WHERE `id` = ?', [newImagePath, date, title, subtitle , link, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'News updated successfully', results: results });
      } else {
        res.status(404).send('News not found for update.');
      }
    });
  });
  



  const fs = require('fs');

  router.delete('/newsslide/:id', async (req, res) => {
    const id = req.params.id;
  
    // First, get the current image path from the database
    dataCategory.query('SELECT `imageSrc` FROM `news-slider` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['imageSrc'];
  
        // Delete the image file
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete the image file.' });
          }
  
          // Delete the image path from the database
          dataCategory.query('DELETE FROM `news-slider` WHERE `id` = ?', [id], (error) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
            }
            res.status(200).json({ message: 'News slider deleted successfully' });
          });
        });
      } else {
        res.status(404).send('Image not found.');
      }
    });
  });
  









module.exports = router;