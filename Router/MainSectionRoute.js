const express = require('express');
const router = express.Router();



//social Data

const MainSectionSocialController =require('../Controller/MainSectionSocialController')

router.post('/addsocial', MainSectionSocialController.addSidemenu);

// GET request to retrieve all sidemenus
router.get('/social', MainSectionSocialController.getSidemenus);

// GET request to retrieve a single sidemenu by id
router.get('/social/:id', MainSectionSocialController.getSidemenuById);

// PUT request to update a sidemenu by id
router.put('/social/:id', MainSectionSocialController.updateSidemenu);

// DELETE request to delete a sidemenu by id
router.delete('/social/:id', MainSectionSocialController.deleteSidemenu);






//text & image for Main section 


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


  router.post('/addtextimgmainsection', upload.single('iconmainsection'), (req, res) => {
    const {text1,	text2,	text3,	paragraph,	buttonName,	buttonLink} = req.body; // Get the title from the request body, could be undefined
    let imagePath = req.file ? path.join('images', req.file.filename) : null; // Set imagePath only if a file was uploaded
    
    // Construct the SQL query dynamically based on what data is provided
    let sql = 'INSERT INTO `main-section` (';
    let placeholders = [];
    let values = [];
    
    if (text1) {
      sql += (values.length > 0 ? ', ' : '') + '`text1`';
      placeholders.push('?');
      values.push(text1);
    }
    
    if (text2) {
      sql += (values.length > 0 ? ', ' : '') + '`text2`';
      placeholders.push('?');
      values.push(text2);
    }


    if (imagePath) {
      sql += (values.length > 0 ? ', ' : '') +  '`icon`';
      placeholders.push('?');
      values.push(imagePath);
    }

    if (text3) {
      sql += (values.length > 0 ? ', ' : '') +  '`text3`';
      placeholders.push('?');
      values.push(text3);
    }
  
    

    if (paragraph) {
      sql += (values.length > 0 ? ', ' : '') + '`paragraph`';
      placeholders.push('?');
      values.push(paragraph);
    }
  
  
    

    if (buttonName) {
      sql += (values.length > 0 ? ', ' : '') + '`buttonName`';
      placeholders.push('?');
      values.push(buttonName);
    }
  
    
  
    

    if (buttonLink) {
      sql += (values.length > 0 ? ', ' : '') + '`buttonLink`';
      placeholders.push('?');
      values.push(buttonLink);
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
      return res.status(200).json({ message: 'Main Section added successfully', path: imagePath, title: text1 });
    });
  });
  


  // Route to retrieve 
  router.get('/textimgmainsection', async (req, res) => {
    
  
    dataCategory.query('SELECT * FROM `main-section`', (error, results) => {
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
router.get('/textimgmainsection/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT * FROM `main-section` WHERE `id` = ?', [id], (error, results) => {
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
router.put('/textimgmainsection/:id', upload.single('iconmainsection'), (req, res) => {
    const id = req.params.id;
    const { text1,	text2,	text3,	paragraph,	buttonName,	buttonLink } = req.body; // Get the title from the request body
    const newImagePath = req.file ? path.join('images', req.file.filename) : undefined;
  
    // Update the database entry
    dataCategory.query('UPDATE `main-section` SET `text1` = ?, `text2` = ?, `icon` = ?, `text3` = ?, `paragraph` = ?, `buttonName` = ?, `buttonLink` = ? WHERE `id` = ?', [text1,text2, newImagePath, text3,	paragraph,	buttonName,	buttonLink , id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'secound main section updated successfully', newPath: newImagePath, title: text1 });
      } else {
        res.status(404).send('Entry not found for update.');
      }
    });
  });
  


  const fs = require('fs');

  router.delete('/textimgmainsection/:id', async (req, res) => {
    const id = req.params.id;
  
    // Get the current image path from the database
    dataCategory.query('SELECT `icon` FROM `main-section` WHERE `id` = ?', [id], (error, results) => {
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
            dataCategory.query('DELETE FROM `main-section` WHERE `id` = ?', [id], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
                }
                res.status(200).json({ message: 'main section deleted successfully' });
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