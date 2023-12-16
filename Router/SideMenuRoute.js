const express = require('express');
const router = express.Router();


//fixed Data

const SideMenuController =require('../Controller/SideMenuController')

router.post('/add', SideMenuController.addSidemenu);

// GET request to retrieve all sidemenus
router.get('/sidemenu', SideMenuController.getSidemenus);

// GET request to retrieve a single sidemenu by id
router.get('/sidemenu/:id', SideMenuController.getSidemenuById);

// PUT request to update a sidemenu by id
router.put('/sidemenu/:id', SideMenuController.updateSidemenu);

// DELETE request to delete a sidemenu by id
router.delete('/sidemenu/:id', SideMenuController.deleteSidemenu);



// content Data:


const SideMenucontentController =require('../Controller/SideMenuContentController')

router.post('/addcontent', SideMenucontentController.addSidemenu);

// GET request to retrieve all sidemenus
router.get('/sidemenucontent', SideMenucontentController.getSidemenus);

// GET request to retrieve a single sidemenu by id
router.get('/sidemenucontent/:id', SideMenucontentController.getSidemenuById);

// PUT request to update a sidemenu by id
router.put('/sidemenucontent/:id', SideMenucontentController.updateSidemenu);

// DELETE request to delete a sidemenu by id
router.delete('/sidemenucontent/:id', SideMenucontentController.deleteSidemenu);









// Image at the below



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
  router.post('/addimgsidemenu', upload.single('imgsidemenu'), (req, res) => {



    let imagePath = req.file ? path.join('imgsidemenu', req.file.filename) : null; 
    
    let sql = 'INSERT INTO `imgsidemenubelow` (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`imgsidemenubelow`';
      placeholders.push('?');
      values.push(imagePath);
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
      return res.status(200).json({ message: 'img side menu below added successfully', path: imagePath });
    });
  });
  



  router.get('/imgsidemenu', async (req, res) => {
 
  
    dataCategory.query('SELECT * FROM `imgsidemenubelow`',  (error, results) => {
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
  




  router.get('/imgsidemenu/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `imgsidemenubelow` FROM `imgsidemenubelow` WHERE `id` = ?', [id], (error, results) => {
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
  





  router.put('/imgsidemenu/:id', upload.single('imgsidemenu'), (req, res) => {
    const id = req.params.id;
  
    let newImagePath;
    if (req.file) {
      newImagePath = path.join('images', req.file.filename);
    } else {
      // Handle the case where no file is uploaded, e.g., image deletion
      newImagePath = ''; // Or set to some default value if necessary
    }
  
    // Update the database with the new image path
    dataCategory.query('UPDATE  `imgsidemenubelow` SET `imgsidemenubelow` = ?  WHERE `id` = ?', [newImagePath, id], (error, results) => {
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

  router.delete('/imgsidemenu/:id', async (req, res) => {
    const id = req.params.id;
  
    // First, get the current image path from the database
    dataCategory.query('SELECT `imgsidemenubelow` FROM `imgsidemenubelow` WHERE `id` = ?', [id], (error, results) => {
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
          dataCategory.query('DELETE FROM imgsidemenubelow WHERE `id` = ?', [id], (error) => {
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