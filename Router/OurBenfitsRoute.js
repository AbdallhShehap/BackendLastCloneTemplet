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


router.post('/add', OurBenfitsController.addOurBenfits);

// GET request to retrieve all sidemenus
router.get('/ourbenfits', OurBenfitsController.getOurBenfits);

// GET request to retrieve a single sidemenu by id
router.get('/ourbenfits/:id', OurBenfitsController.getOurBenfitsById);

// PUT request to update a sidemenu by id
router.put('/ourbenfits/:id', OurBenfitsController.updateOurBenfits);

// DELETE request to delete a sidemenu by id
router.delete('/ourbenfits/:id', OurBenfitsController.deleteOurBenfits);





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
  router.post('/addimg', upload.single('imgourbenefits'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const imagePath = path.join('images', req.file.filename);
  
    dataCategory.query('INSERT INTO imgourbenefits (`img-path-ourbenefits`) VALUES (?)', [imagePath], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({ message: 'Image added successfully', path: imagePath });
    });
  });
  





  router.get('/imgourbenefits/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `img-path-ourbenefits` FROM imgourbenefits WHERE `id-img-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['img-path-ourbenefits'];
        // Assuming you're serving the 'images' folder statically with Express
        res.status(200).json({ imagePath: imagePath });
      } else {
        res.status(404).send('Image not found.');
      }
    });
  });
  





  router.put('/imgourbenefits/:id', upload.single('imgourbenefits'), (req, res) => {
    const id = req.params.id;
  
    if (!req.file) {
      return res.status(400).send('No new file uploaded for update.');
    }
  
    const newImagePath = path.join('images', req.file.filename);
  
    // Update the database with the new image path
    dataCategory.query('UPDATE imgourbenefits SET `img-path-ourbenefits` = ? WHERE `id-img-ourbenefits` = ?', [newImagePath, id], (error, results) => {
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
    dataCategory.query('SELECT `img-path-ourbenefits` FROM imgourbenefits WHERE `id-img-ourbenefits` = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.length > 0) {
        const imagePath = results[0]['img-path-ourbenefits'];
  
        // Delete the image file
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete the image file.' });
          }
  
          // Delete the image path from the database
          dataCategory.query('DELETE FROM imgourbenefits WHERE `id-img-ourbenefits` = ?', [id], (error) => {
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