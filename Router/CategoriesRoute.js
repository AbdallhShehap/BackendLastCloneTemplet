const express = require('express');
const router = express.Router();
const fs = require('fs');


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


// name id in the categories table  id-category				


// Route to handle file upload and add title
router.post('/addcategory', upload.single('imagecategory'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const imagePath = path.join('images', req.file.filename);
    const { toptext , bottomtext } = req.body; // Get the title from the request body
  
    // Insert the image path and title into the database
    dataCategory.query('INSERT INTO categories (`image-category-path`, `toptext-category`, `bottomtext-category`) VALUES (?, ?,?)', [imagePath, toptext , bottomtext ], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({ message: 'Categories added successfully' });
    });
  });
  






// Get all categories
router.get('/categories', async (req, res) => {
  dataCategory.query('SELECT * FROM `categories`', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    res.status(200).json(results);
  });
});






// Get a single category by ID
router.get('/categories/:id', async (req, res) => {
  const id = req.params.id;
  dataCategory.query('SELECT * FROM `categories` WHERE `id-category` = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send('Category not found.');
    }
  });
});




router.put('/categories/:id', upload.single('imagecategory'), (req, res) => {
  const id = req.params.id;
  let sql = 'UPDATE `categories` SET ';
  const values = [];
  
  if (req.file) {
    const imagePath = path.join('images', req.file.filename);
    sql += '`image-category-path` = ?, ';
    values.push(imagePath);
  }
  if (req.body.toptext) {
    sql += '`toptext-category` = ?, ';
    values.push(req.body.toptext);
  }
  if (req.body.bottomtext) {
    sql += '`bottomtext-category` = ?, ';
    values.push(req.body.bottomtext);
  }

  // Remove the last comma and space if we added values
  if (values.length > 0) {
    sql = sql.slice(0, -2); // Remove last comma and space
    sql += ' WHERE `id-category` = ?';
    values.push(id);

    dataCategory.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Category not found or no new data to update.');
      }
      res.status(200).json({ message: 'Category updated successfully' });
    });
  } else {
    return res.status(400).send('No new data provided for update.');
  }
});



router.delete('/categories/:id', async (req, res) => {
  const id = req.params.id;

  // Optionally, delete the image file associated with the category
  // You might want to remove this part if the images are shared between categories or used elsewhere
  
  // Get the image path before deleting the category
  dataCategory.query('SELECT `image-category-path` FROM `categories` WHERE `id-category` = ?', [id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (result.length > 0) {
      const imagePath = result[0]['image-category-path'];
      fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
        // even if error on image deletion, proceed to delete the category
        if (err) {
          console.error(err);
        }
      });
    }

    // Now delete the category
    dataCategory.query('DELETE FROM `categories` WHERE `id-category` = ?', [id], (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    });
  });
});







  module.exports = router;