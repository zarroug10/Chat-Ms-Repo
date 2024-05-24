// messageController.js

const Message = require('../Model/message');
const User = require('../Model/User');
const jwt = require('jsonwebtoken');
  
exports.getMessagesByLocation = async (req, res) => {
  try {
      const token = req.headers.authorization;
      if (!token) {
          return res.status(401).json({ error: 'No token provided' });
      }

      // Decode the token to get user information
      const decoded = jwt.verify(token, 'your_secret_key_here'); // Replace 'your_secret_key_here' with your actual secret key

      // Extract user location from decoded token
      const userLocation = decoded.location; // Assuming location is stored in the token as 'location'
      const userId = decoded.userId;

      // Fetch messages based on the user's location
      const query = `SELECT * FROM Messages WHERE location = ?`;
      Message.query(query, [userLocation], (error, messages, fields) => {
          if (error) {
              console.error('Error fetching messages by location:', error);
              return res.status(500).json({ error: 'An error occurred while fetching messages by location' });
          }

          // Fetch deletion actions for the current user from the MessageDeletions table
          const deletionQuery = 'SELECT message_id FROM MessageDeletions WHERE user_id = ?';
          Message.query(deletionQuery, [userId], (deletionError, deletions, deletionFields) => {
              if (deletionError) {
                  console.error('Error fetching deletion actions:', deletionError);
                  return res.status(500).json({ error: 'An error occurred while fetching deletion actions' });
              }

              // Filter out messages that have deletion actions for the current user
              const filteredMessages = messages.filter(message => !deletions.some(deletion => deletion.message_id === message.id));

              res.status(200).json(filteredMessages);
          });
      });
  } catch (error) {
      console.error('Error fetching messages by location:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages by location' });
  }
};

exports.sendMessages = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { messageContent, location } = req.body;
      const userId = decoded.userId;

      if (!messageContent || !location) {
        return res.status(400).json({ error: 'messageContent and location are required' });
      }

      try {
        const query = 'INSERT INTO messages ( location, messageContent, userId) VALUES (?, ?, ?)';
        Message.query(query, [ location, messageContent, userId], (error, results, fields) => {
          if (error) {
            console.error('Error saving messages:', error);
            return res.status(500).json({ error: 'An error occurred while saving the messages' });
          }
          res.status(201).json({ message: 'messages sent successfully', messages: results });
        });
      } catch (error) {
        console.error('Error saving messages:', error);
        res.status(500).json({ error: 'An error occurred while saving the messages' });
      }
    });
  }
   catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ error: 'An error occurred while verifying token' });
  }
};

exports.deleteMessage = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const messageId = req.params.id; // Assuming message ID is sent in the URL parameters
            const userId = decoded.userId;

            try {
                // Check if the user is authorized to delete the message (Optional step)
                // You might want to implement additional authorization logic here
                const query = 'INSERT INTO MessageDeletions (message_id, user_id) VALUES (?, ?)';
                Message.query(query, [messageId, userId], (error, results, fields) => {
                    if (error) {
                        console.error('Error marking message as deleted:', error);
                        res.status(500).json({ error: 'An error occurred while marking message as deleted' });
                        return;
                    }
                    
                    res.status(200).json({ message: 'Message marked as deleted successfully' });
                });
            } catch (error) {
                console.error('Error marking message as deleted:', error);
                res.status(500).json({ error: 'An error occurred while marking message as deleted' });
            }
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'An error occurred while verifying token' });
    }
};