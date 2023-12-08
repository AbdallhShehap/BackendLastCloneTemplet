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


  router.post('/add', upload.single('imagethirdmarquee'), (req, res) => {
    const { titlethirdmarquee } = req.body; // Get the title from the request body, could be undefined
    let imagePath = req.file ? path.join('images', req.file.filename) : null; // Set imagePath only if a file was uploaded
    
    // Construct the SQL query dynamically based on what data is provided
    let sql = 'INSERT INTO thirdmarquee (';
    let placeholders = [];
    let values = [];
    
    if (imagePath) {
      sql += '`imageThirdMarqueePath`';
      placeholders.push('?');
      values.push(imagePath);
    }
  
    if (titlethirdmarquee) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`title-third-marquee`';
      placeholders.push('?');
      values.push(titlethirdmarquee);
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
      return res.status(200).json({ message: 'third Marquee added successfully', path: imagePath, title: titlethirdmarquee });
    });
  });
  


  // Route to retrieve 
  router.get('/thirdmarquee', async (req, res) => {
    
  
    dataCategory.query('SELECT * FROM `thirdmarquee`', (error, results) => {
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
router.get('/thirdmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    dataCategory.query('SELECT `imageThirdMarqueePath`, `title-third-marquee` FROM thirdmarquee WHERE `id-third-marquee` = ?', [id], (error, results) => {
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
router.put('/thirdmarquee/:id', upload.single('imagethirdmarquee'), (req, res) => {
    const id = req.params.id;
    const { titlethirdmarquee } = req.body; // Get the title from the request body
    const newImagePath = req.file ? path.join('images', req.file.filename) : undefined;
  
    // Update the database entry
    dataCategory.query('UPDATE thirdmarquee SET `imageThirdMarqueePath` = ?, `title-third-marquee` = ? WHERE `id-third-marquee` = ?', [newImagePath, titlethirdmarquee, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'third Marquee updated successfully', newPath: newImagePath, title: titlethirdmarquee });
      } else {
        res.status(404).send('Entry not found for update.');
      }
    });
  });
  


  const fs = require('fs');

  router.delete('/thirdmarquee/:id', async (req, res) => {
    const id = req.params.id;
  
    // Get the current image path from the database
    dataCategory.query('SELECT `imageThirdMarqueePath` FROM thirdmarquee WHERE `id-third-marquee` = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }

        if (results.length === 0) {
            return res.status(404).send('Entry not found.');
        }

        const imagePath = results[0]['imageThirdMarqueePath'];
  
        // Function to delete the database record
        const deleteRecord = () => {
            dataCategory.query('DELETE FROM thirdmarquee WHERE `id-third-marquee` = ?', [id], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
                }
                res.status(200).json({ message: 'third Marquee deleted successfully' });
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






// Route top circle img upload


const uploadtop = multer({ storage: storage });
const multipleUploadtop = uploadtop.array('topCircleImg', 3); // Allows up to 3 images



router.post('/addtopimg', multipleUploadtop, (req, res) => {
  // Check if any files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  // Iterate over each file and insert into the database
  req.files.forEach(file => {
    const imgPath = path.join('images', file.filename);

    dataCategory.query('INSERT INTO `top-circle-img` (`topCircleImgPath`) VALUES (?)', 
      [imgPath], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }
    });
  });

  // Respond once all files are processed
  return res.status(200).json({
    message: 'Images added successfully',
  });
});





router.get('/topcircleimg', async (req, res) => {
  dataCategory.query('SELECT * FROM `top-circle-img`', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json(results);
  });
});





router.put('/topcircleimg/:id', multipleUploadtop, (req, res) => {
  const id = req.params.id;
  const updates = {};
  const fields = [];
  const values = [];
  
  if (req.files.topCircleImg1) {
    updates['topCircleImg1Path'] = path.join('images', req.files.topCircleImg1[0].filename);
    fields.push('`topCircleImg1Path` = ?');
    values.push(updates['topCircleImg1Path']);
  }
  if (req.files.topCircleImg2) {
    updates['topCircleImg2Path'] = path.join('images', req.files.topCircleImg2[0].filename);
    fields.push('`topCircleImg2Path` = ?');
    values.push(updates['topCircleImg2Path']);
  }
  if (req.files.topCircleImg3) {
    updates['topCircleImg3Path'] = path.join('images', req.files.topCircleImg3[0].filename);
    fields.push('`topCircleImg3Path` = ?');
    values.push(updates['topCircleImg3Path']);
  }

  if (fields.length > 0) {
    const sql = `UPDATE \`top-circle-img\` SET ${fields.join(', ')} WHERE \`id-top-circle-img\` = ?`;
    values.push(id);

    dataCategory.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({
        message: 'Images updated successfully',
        updatedPaths: updates
      });
    });
  } else {
    return res.status(400).send('No images were uploaded for update.');
  }
});





router.delete('/topcircleimg/:id', async (req, res) => {
  const id = req.params.id;
 
  // Get the image paths from the database
  dataCategory.query('SELECT `topCircleImg1Path`, `topCircleImg2Path`, `topCircleImg3Path` FROM `top-circle-img` WHERE `id-top-circle-img` = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (results.length > 0) {
      const imagePaths = results[0];
      
      // Delete image files
      Object.values(imagePaths).forEach((imagePath) => {
        if (imagePath) {
          fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
            if (err) console.error(err); // Log error, don't return to allow other deletions
          });
        }
      });

      // Delete the database entry
      dataCategory.query('DELETE FROM `top-circle-img` WHERE `id-top-circle-img` = ?', [id], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }
        res.status(200).json({ message: 'Top circle images deleted successfully' });
      });
    } else {
      res.status(404).send('Entry not found.');
    }
  });
});






















const uploadbottom = multer({ storage: storage });
const multipleUploadbottom = uploadbottom.array('bottomCircleImg', 3); // Allows up to 3 images


// Route bottom circle img upload
router.post('/addbottomimg', multipleUploadbottom, (req, res) => {
   // Check if any files were uploaded
   if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

 // Iterate over each file and insert into the database
 req.files.forEach(file => {
  const imgPath = path.join('images', file.filename);

  dataCategory.query('INSERT INTO `bottom-circle-img` (`bottomCircleImgPath`) VALUES (?)', 
    [imgPath], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
  });
});
  // Respond once all files are processed
  return res.status(200).json({
    message: 'Images added successfully',
  });
});
  





router.get('/bottomcircleimg', async (req, res) => {
  dataCategory.query('SELECT * FROM `bottom-circle-img`', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json(results);
  });
});







router.put('/bottomcircleimg/:id', multipleUploadbottom, (req, res) => {
  const id = req.params.id;
  const updates = {};
  const fields = [];
  const values = [];

  if (req.files.bottomCircleImg1) {
    updates['bottom-circle-img1-path'] = path.join('images', req.files.bottomCircleImg1[0].filename);
    fields.push('`bottom-circle-img1-path` = ?');
    values.push(updates['bottom-circle-img1-path']);
  }
  if (req.files.bottomCircleImg2) {
    updates['bottom-circle-img2-path'] = path.join('images', req.files.bottomCircleImg2[0].filename);
    fields.push('`bottom-circle-img2-path` = ?');
    values.push(updates['bottom-circle-img2-path']);
  }
 

  if (fields.length > 0) {
    const sql = `UPDATE \`bottom-circle-img\` SET ${fields.join(', ')} WHERE \`id-bottom-circle-img\` = ?`;
    values.push(id);

    dataCategory.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
      }
      return res.status(200).json({
        message: 'Images updated successfully',
        updatedPaths: updates
      });
    });
  } else {
    return res.status(400).send('No images were uploaded for update.');
  }
});







router.delete('/bottomcircleimg/:id', async (req, res) => {
  const id = req.params.id;

  // Get the image paths from the database
  dataCategory.query('SELECT `bottom-circle-img1-path`, `bottom-circle-img2-path` FROM `bottom-circle-img` WHERE `id-bottom-circle-img` = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (results.length > 0) {
      const imagePaths = results[0];
      
      // Delete image files
      Object.values(imagePaths).forEach((imagePath) => {
        if (imagePath) {
          fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
            if (err) console.error(err); // Log error, don't return to allow other deletions
          });
        }
      });

      // Delete the database entry
      dataCategory.query('DELETE FROM `bottom-circle-img` WHERE `id-bottom-circle-img` = ?', [id], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
        }
        res.status(200).json({ message: 'Top circle images deleted successfully' });
      });
    } else {
      res.status(404).send('Entry not found.');
    }
  });
});











module.exports = router;