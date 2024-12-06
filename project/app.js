const express = require('express');
const cors = require('cors');
const { parse, validate } = require('@telegram-apps/init-data-node');
const supabase = require('./server'); // Adjust according to your database setup

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_SECRET = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your actual bot token

// Validate and parse initData
app.post('/api/validate-init', async (req, res) => {
  const { initData } = req.body;

  try {
    // Validate the initData
    validate(initData, TELEGRAM_SECRET);

    // Parse initData
    const parsedData = parse(initData);
    const userId = parsedData.user?.id;
    const userName = parsedData.user?.username || parsedData.user?.firstName;

    if (!userId || !userName) {
      return res.status(400).json({ error: 'Invalid initData' });
    }

    // Check if the user exists in the database
    const { data: user, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If user does not exist, create one
      const { data: newUser, error: createError } = await supabase
        .from('profile')
        .insert([{ id: userId, userName, created_at: new Date() }]);

      if (createError) {
        return res.status(500).json({ error: createError.message });
      }

      return res.status(201).json({ message: 'User created', user: newUser });
    }

    // If user exists, return success
    res.status(200).json({ message: 'User exists', user });
  } catch (e) {
    console.error('Validation error:', e);
    res.status(400).json({ error: e.message });
  }
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
