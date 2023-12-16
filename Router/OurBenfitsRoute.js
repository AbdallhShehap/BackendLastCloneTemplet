const express = require('express');
const router = express.Router();

const OurBenfitsController =require('../Controller/OurBenfitsController')





// content our benfits


router.post('/addcontent', OurBenfitsController.addOurBenfitsContent);

// GET request to retrieve all sidemenus
router.get('/ourbenfitscontent', OurBenfitsController.getOurBenfitsContent);

// GET request to retrieve a single sidemenu by id
router.get('/ourbenfitscontent/:id', OurBenfitsController.getOurBenfitsContentById);

// PUT request to update a sidemenu by id
router.put('/ourbenfitscontent/:id', OurBenfitsController.updateOurBenfitsContent);

// DELETE request to delete a sidemenu by id
router.delete('/ourbenfitscontent/:id', OurBenfitsController.deleteOurBenfitsContent);


// title our benfits


// router.post('/add', OurBenfitsController.addOurBenfits);

// // GET request to retrieve all sidemenus
// router.get('/ourbenfits', OurBenfitsController.getOurBenfits);

// // GET request to retrieve a single sidemenu by id
// router.get('/ourbenfits/:id', OurBenfitsController.getOurBenfitsById);

// // PUT request to update a sidemenu by id
// router.put('/ourbenfits/:id', OurBenfitsController.updateOurBenfits);

// // DELETE request to delete a sidemenu by id
// router.delete('/ourbenfits/:id', OurBenfitsController.deleteOurBenfits);





// image our benfits




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
  router.post('/addfixedourbenefits', upload.single('imgourbenefits'), (req, res) => {

    const { sectionTitile, sectionSubtitile } = req.body;

    let imagePath = req.file ? path.join('images', req.file.filename) : null; // Set imagePath only if a file was uploaded
    
    let sql = 'INSERT INTO `imgourbenefits` (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`imgSection`';
      placeholders.push('?');
      values.push(imagePath);
    }

    
    if (sectionTitile) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`sectionTitile`';
      placeholders.push('?');
      values.push(sectionTitile);
    }


    if (sectionSubtitile) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`sectionSubtitile`';
      placeholders.push('?');
      values.push(sectionSubtitile);
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
      return res.status(200).json({ message: 'Our Benfits added successfully', path: imagePath, title: sectionTitile });
    });
  });
  



  router.get('/imgourbenefits', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM `imgourbenefits`',  (error, results) => {
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
  




  router.get('/imgourbenefits/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `imgSection` FROM `imgourbenefits` WHERE `id` = ?', [id], (error, results) => {
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
  





  router.put('/imgourbenefits/:id', upload.single('imgourbenefits'), (req, res) => {
    const id = req.params.id;
  
    let newImagePath;
    if (req.file) {
      newImagePath = path.join('images', req.file.filename);
    } else {
      // Handle the case where no file is uploaded, e.g., image deletion
      newImagePath = ''; // Or set to some default value if necessary
    }
  
    // Update the database with the new image path
    dataCategory.query('UPDATE  `imgourbenefits` SET `imgSection` = ?  WHERE `id` = ?', [newImagePath, id], (error, results) => {
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

  router.delete('/imgourbenefits/:id', async (req, res) => {
    const id = req.params.id;
  
    // First, get the current image path from the database
    dataCategory.query('SELECT `imgSection` FROM ourbenefits WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['imgSection'];
  
        // Delete the image file
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete the image file.' });
          }
  
          // Delete the image path from the database
          dataCategory.query('DELETE FROM ourbenefits WHERE `id` = ?', [id], (error) => {
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
  








  router.post('/addtextourbenefits', (req, res) => {
    const { sectionTitile, sectionSubtitile } = req.body;
  
    let sql = 'INSERT INTO `ourbenefits` (';
    let placeholders = [];
    let values = [];
  
    if (sectionTitile) {
      sql += '`sectionTitile`';
      placeholders.push('?');
      values.push(sectionTitile);
    }
  
    if (sectionSubtitile) {
      // Add a comma if there is already a column listed
      if (values.length > 0) {
        sql += ', ';
      }
      sql += '`sectionSubtitile`';
      placeholders.push('?');
      values.push(sectionSubtitile);
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
      return res.status(200).json({ message: 'Our Benfits added successfully', title: sectionTitile });
    });
  });
  

  
  router.get('/textourbenefits', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM `ourbenefits`',  (error, results) => {
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
  




  router.get('/textourbenefits/:id', async (req, res) => {
    const id = req.params.id;
    dataCategory.query('SELECT * FROM `ourbenefits` WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        console.error(error); // Log the error to the console for debugging.
        res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Our Benfits not found' }); // If no results are found.
        }
      }
    });
  });
  



  router.put('/textourbenefits/:id',  (req, res) => {
    const id = req.params.id;
    const {  sectionTitile, sectionSubtitile } = req.body;
  
 
  
    // Update the database with the new image path
    dataCategory.query('UPDATE ourbenefits SET `sectionTitile` = ?  , `sectionSubtitile` = ? WHERE `id` = ?', [ sectionTitile, sectionSubtitile, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Image updated successfully' });
      } else {
        res.status(404).send('Image not found for update.');
      }
    });
  });
  



  router.delete('/textourbenefits/:id', async (req, res) => {
    const id = req.params.id;
    dataCategory.query('DELETE FROM ourbenefits WHERE `id` = ?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'our benefits ixed deleted successfully' });
      }
    });
  })






module.exports = router;