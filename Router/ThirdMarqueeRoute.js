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
    const { titleThirdMarquee } = req.body; // Get the title from the request body, could be undefined
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
  
    if (titleThirdMarquee) {
      if (imagePath) sql += ', '; // Add a comma only if there was also an image
      sql += '`titleThirdMarquee`';
      placeholders.push('?');
      values.push(titleThirdMarquee);
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
      return res.status(200).json({ message: 'third Marquee added successfully', path: imagePath, title: titleThirdMarquee });
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
  
    dataCategory.query('SELECT `imageThirdMarqueePath`, `titleThirdMarquee` FROM thirdmarquee WHERE `id-third-marquee` = ?', [id], (error, results) => {
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
  const { titleThirdMarquee } = req.body;

  let updateQuery = 'UPDATE thirdmarquee SET ';
  let updateValues = [];
  
  if (req.file) {
    const newImagePath = path.join('images', req.file.filename);
    updateQuery += '`imageThirdMarqueePath` = ?';
    updateValues.push(newImagePath);
  }

  if (titleThirdMarquee) {
    if (updateValues.length > 0) {
      updateQuery += ', ';
    }
    updateQuery += '`titleThirdMarquee` = ?';
    updateValues.push(titleThirdMarquee);
  }

  updateQuery += ' WHERE `id-third-marquee` = ?';
  updateValues.push(id);

  dataCategory.query(updateQuery, updateValues, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'third Marquee updated successfully', newPath: req.file ? req.file.filename : 'No new image uploaded', title: titleThirdMarquee });
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
const uploadFields = [
  { name: 'topCircleImg', maxCount: 3 }, // Field for multiple images
  { name: 'singleTopCircleImg', maxCount: 1 } // Field for a single image
];

router.post('/addtopimg', uploadtop.fields(uploadFields), (req, res) => {
  // Check if any files were uploaded
  if ((!req.files['topCircleImg'] || req.files['topCircleImg'].length === 0) && 
      (!req.files['singleTopCircleImg'] || req.files['singleTopCircleImg'].length === 0)) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const files = [...(req.files['topCircleImg'] || []), ...(req.files['singleTopCircleImg'] || [])];

  // Iterate over each file and insert into the database
  files.forEach(file => {
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
    message: 'Images added successfully',imgPath:imgPath
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






router.get('/topcircleimg/:id', async (req, res) => {
  const id = req.params.id;
  dataCategory.query('SELECT `topCircleImgPath` FROM `top-circle-img` WHERE `id-top-circle-img` = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json(results);
  });
});





router.put('/topcircleimg/:id', uploadtop.fields(uploadFields), (req, res) => {
  const id = req.params.id;

  let imgPath;

  // Check if single image file was uploaded
  if (req.files['singleTopCircleImg'] && req.files['singleTopCircleImg'].length > 0) {
    imgPath = path.join('images', req.files['singleTopCircleImg'][0].filename);
  } else if (req.files['topCircleImg'] && req.files['topCircleImg'].length > 0) {
    // If no single image, check for the first image in the multiple images array
    imgPath = path.join('images', req.files['topCircleImg'][0].filename);
  } else {
    return res.status(400).send('No images were uploaded for update.');
  }

  const sql = 'UPDATE `top-circle-img` SET `topCircleImgPath` = ? WHERE `id-top-circle-img` = ?';

  dataCategory.query(sql, [imgPath, id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json({
      message: 'Image updated successfully',
      updatedPath: imgPath
    });
  });
});




router.delete('/topcircleimg/:id', async (req, res) => {
  const id = req.params.id;
 
  // Get the image paths from the database
  dataCategory.query('SELECT `topCircleImgPath` FROM `top-circle-img` WHERE `id-top-circle-img` = ?', [id], (error, results) => {
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









//bottom circle img












const uploadbottom = multer({ storage: storage });
const multipleUploadbottom = uploadbottom.array('bottomCircleImg', 3); // Allows up to 3 images
const uploadBottomFields = [
  { name: 'bottomCircleImg', maxCount: 3 }, // Field for multiple images
  { name: 'singleBottomCircleImg', maxCount: 1 } // Field for a single image
];

// Route bottom circle img upload
router.post('/addbottomimg', uploadbottom.fields(uploadBottomFields),  (req, res) => {

// Check if any files were uploaded
if ((!req.files['bottomCircleImg'] || req.files['bottomCircleImg'].length === 0) && 
(!req.files['singleBottomCircleImg'] || req.files['singleBottomCircleImg'].length === 0)) {
return res.status(400).json({ error: 'No files uploaded' });
}

const files = [...(req.files['bottomCircleImg'] || []), ...(req.files['singleBottomCircleImg'] || [])];

// Iterate over each file and insert into the database
files.forEach(file => {
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



router.get('/bottomcircleimg/:id', async (req, res) => {
  const id = req.params.id;
  dataCategory.query('SELECT `bottomCircleImgPath` FROM `bottom-circle-img` WHERE `id-bottom-circle-img` = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json(results);
  });
});




router.put('/bottomcircleimg/:id', uploadbottom.fields(uploadBottomFields), (req, res) => {
  const id = req.params.id;
  let imgPath;

  // Check if single image file was uploaded
  if (req.files['singleBottomCircleImg'] && req.files['singleBottomCircleImg'].length > 0) {
    imgPath = path.join('images', req.files['singleBottomCircleImg'][0].filename);
  } else if (req.files['bottomCircleImg'] && req.files['bottomCircleImg'].length > 0) {
    // If no single image, check for the first image in the multiple images array
    imgPath = path.join('images', req.files['bottomCircleImg'][0].filename);
  } else {
    return res.status(400).send('No images were uploaded for update.');
  }

  const sql = 'UPDATE `bottom-circle-img` SET `bottomCircleImgPath` = ? WHERE `id-bottom-circle-img` = ?';

  dataCategory.query(sql, [imgPath, id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.sqlMessage });
    }
    return res.status(200).json({
      message: 'Image updated successfully',
      updatedPath: imgPath
    });
  });
});







router.delete('/bottomcircleimg/:id', async (req, res) => {
  const id = req.params.id;

  // Get the image paths from the database
  dataCategory.query('SELECT `bottomCircleImgPath` FROM `bottom-circle-img` WHERE `id-bottom-circle-img` = ?', [id], (error, results) => {
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