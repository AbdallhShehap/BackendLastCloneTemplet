const dbConnection = require("../Module/allData");


class SuperadminModel {
    createSuperadmin(superadminData) {
      return new Promise((resolve, reject) => {
        dbConnection.query('INSERT INTO superadmin SET email = ?, password = ?, role = ?', [superadminData.email, superadminData.password, superadminData.role === 'admin' ? 'admin' : 'standard'], (error, results) => {        if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    }
    
    
      findByEmail(email) {
        return new Promise((resolve, reject) => {
          dbConnection.query('SELECT * FROM superadmin WHERE email = ?', email, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      }
  
      updateToken(superadminId, token) {
        return new Promise((resolve, reject) => {
          dbConnection.query('UPDATE superadmin SET token = ? WHERE id = ?', [token, superadminId], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }
  
      clearToken(superadminId) {
        return new Promise((resolve, reject) => {
          dbConnection.query('UPDATE superadmin SET token = NULL WHERE id = ?', superadminId, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }
  
      updateVerifyStatus(superadminId, verify) {
        return new Promise((resolve, reject) => {
          dbConnection.query('UPDATE superadmin SET verify = ? WHERE id = ?', [verify, superadminId], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }
  
      getAllSuperadmins() {
        return new Promise((resolve, reject) => {
          dbConnection.query('SELECT * FROM superadmin', (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }
  
      updateSuperadmin(superadminId, updatedData) {
        return new Promise((resolve, reject) => {
          dbConnection.query(
            'UPDATE superadmin SET email = ?, password = ?, role = ? WHERE id = ?',
            [updatedData.email, updatedData.password, updatedData.role === 'admin' ? 'admin' : 'standard', superadminId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      }
      
  
      getSuperadminById(superadminId) {
        return new Promise((resolve, reject) => {
          dbConnection.query('SELECT * FROM superadmin WHERE id = ?', superadminId, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      }
      
      deleteSuperadmin(superadminId) {
        return new Promise((resolve, reject) => {
          dbConnection.query('DELETE FROM superadmin WHERE id = ?', superadminId, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }
      
  
  
    }
    
    module.exports = new SuperadminModel();
  