const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const SuperadminModel = require('../Module/SuperadminModel');

const tokenFilePath = 'token.json';
let tokenStorage = {}; // Temporary storage for tokens

class SuperadminController {
  async signup(req, res) {
    const { email, password, role } = req.body;
  
    if (!email || !password || role === undefined ) {
      return res.status(404).json({
        data: null,
        success: false,
         message: 'Invalid input data.' });
    }
    
    try {
      // Check if the email already exists in the database
      const existingUser = await SuperadminModel.findByEmail(email);
      if (existingUser) {
        return res.status(404).json({
          data: null,
          success: false,
           message: 'Email already exists. Please use a different email.' });
      }
  
      // If the email is unique, proceed with user creation
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'standard', // Store 'admin' or 'standard' as a string      
      };
  
      await SuperadminModel.createSuperadmin(newUser);
      res.status(200).json({ message: 'Superadmin created.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create superadmin.' });
    }
  }
  
  
  
  async login(req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Email and password are required.'
      });
    }
  
    try {
      const superadmin = await SuperadminModel.findByEmail(email);
  
      if (!superadmin) {
        return res.status(401).json({
          data: null,
          success: false,
          message: 'Email or password is incorrect.'
        });
      }
  
      const isMatch = await bcrypt.compare(password, superadmin.password);
  
      if (isMatch) {
        // Set the verify status to 1 on successful login
        await SuperadminModel.updateVerifyStatus(superadmin.id, 1);
  
        const token = jwt.sign({ id: superadmin.id, email: superadmin.email }, 'your_secret_key');
  
        // Store the token temporarily
        tokenStorage[superadmin.id] = token;
  
        // Update the token in the database
        await SuperadminModel.updateToken(superadmin.id, token);
  
        return res.status(200).json({
          data: superadmin, // Here, use 'superadmin' instead of 'user'
          success: true,
          message: 'Login successful.',
          token: token,
          role: superadmin.role
        });
  
      } else {
        return res.status(401).json({
          data: null,
          success: false,
          message: 'Email or password is incorrect.'
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Internal server error: ' + error.message
      });
    }
  }
  
  
  async logout(req, res) {
    try {
      // Get the token from the request (you can pass it in the request header or body)
      const { token } = req.body;
  
      // Check if a token is provided in the request
      if (!token) {
        return res.status(401).json({
          data: null,
          success: false,
          message: 'Token is required for logout.'
        });
      }
  
      // Verify and decode the token to identify the user (you need to use the same secret key)
      const decoded = jwt.verify(token, 'your_secret_key');
      const superadminId = decoded.id;
  
      // Clear the verify status to 0 on successful logout
      await SuperadminModel.updateVerifyStatus(superadminId, 0);
  
      // Clear the token in the JSON file
      fs.writeFileSync(tokenFilePath, JSON.stringify({ token: null }));
  
      // Clear the token from temporary storage
      delete tokenStorage[superadminId];
  
      // Clear the token in the database (update with null)
      await SuperadminModel.clearToken(superadminId);
  
      return res.status(200).json({
        success: true,
        message: 'Logout successful.'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Internal server error.'
      });
    }
  }
  

  async getAllSuperadmins(req, res) {
    try {
      const superadmins = await SuperadminModel.getAllSuperadmins();
      return res.status(200).json({
        data: superadmins, // Corrected to 'superadmins'
        success: true,
        message: 'Successfully retrieved all superadmins.' // Updated message
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Internal server error.'
      });
    }
  }
  
  async updateSuperadmin(req, res) {
    const superadminId = req.params.id;
    const { email, password, role } = req.body;
  
    // Validate input data
    if (!email || !password || role === undefined) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Invalid input data.'
      });
    }
  
    try {
      // Check if the superadmin with the given id exists in the database
      const existingSuperadmin = await SuperadminModel.getSuperadminById(superadminId);
      if (!existingSuperadmin) {
        return res.status(401).json({
          data: null,
          success: false,
          message: 'Superadmin not found.'
        });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Prepare updated data
      const updatedData = {
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'standard'
      };
  
      // Update the superadmin's information in the database
      await SuperadminModel.updateSuperadmin(superadminId, updatedData);
  
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Superadmin updated successfully.'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to update superadmin.'
      });
    }
  }
  
  

  async deleteSuperadmin(req, res) {
    const superadminId = req.params.id;
  
    try {
      // Check if the superadmin with the given ID exists in the database
      const existingSuperadmin = await SuperadminModel.getSuperadminById(superadminId);
      if (!existingSuperadmin) {
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Superadmin not found.'
        });
      }
  
      // Delete the superadmin from the database
      await SuperadminModel.deleteSuperadmin(superadminId);
  
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Superadmin deleted successfully.'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to delete superadmin.'
      });
    }
  }
  
  
  
  
  
}

module.exports = new SuperadminController();
