const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = '25252525252525252525';
const pendingCommands = [];

app.post('/discord-to-roblox', (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) return res.status(403).json({ error: 'Unauthorized' });
  
  const { command, args } = req.body;
  
  // 🌟 FIX: Capture the custom username header sent from your Discord bot
  const discordUser = req.headers['x-discord-user'] || 'Unknown Admin';

  if (!command) return res.status(400).json({ error: 'Missing command' });
  
  // 🌟 FIX: Include 'executor: discordUser' inside the saved command object
  pendingCommands.push({ 
    command, 
    args: args || [], 
    executor: discordUser, 
    timestamp: Date.now() 
  });
  
  res.json({ ok: true });
});

app.get('/poll', (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) return res.status(403).json({ error: 'Unauthorized' });
  const cmds = [...pendingCommands];
  pendingCommands.length = 0;
  res.json({ commands: cmds });
});

app.get('/', (req, res) => res.send('Middleman is running!'));

const PORT = process.env.PORT || 3000; // Updated to support Render's dynamic ports seamlessly
app.listen(PORT, () => console.log('Middleman running on port ' + PORT));
