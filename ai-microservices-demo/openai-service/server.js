const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Categories for notes
const CATEGORIES = [
  "Work",
  "Personal",
  "Shopping",
  "Ideas",
  "Health",
  "Finance",
  "Travel",
  "Education"
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Text analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Prepare a prompt for sentiment analysis
    const prompt = `Analyze the sentiment of the following text. Respond with either "POSITIVE", "NEGATIVE", or "NEUTRAL": \n\n"${text}"`;
    
    // Call OpenAI API
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 10,
      temperature: 0.3
    });
    
    // Parse the response to get the sentiment
    const sentiment = completion.choices[0].text.trim();
    
    // Record token usage for monitoring
    if (completion.usage) {
      monitoring.recordTokenUsage(
        'gpt-3.5-turbo-instruct',
        '/analyze',
        completion.usage.prompt_tokens,
        completion.usage.completion_tokens
      );
    }
    
    return res.json({ 
      sentiment,
      confidence: 0.9 // OpenAI doesn't provide confidence scores, so we use a placeholder
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    monitoring.recordApiError(error.name || 'UnknownError');
    return res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// Categorize endpoint
app.post('/categorize', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Prepare a prompt for categorization
    const prompt = `Categorize the following note into exactly one of these categories: ${CATEGORIES.join(', ')}.\n\nNote: "${text}"\n\nCategory:`;
    
    // Call OpenAI API
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 10,
      temperature: 0.3
    });
    
    // Parse the response to get the category
    const category = completion.choices[0].text.trim();
    
    // Record token usage for monitoring
    if (completion.usage) {
      monitoring.recordTokenUsage(
        'gpt-3.5-turbo-instruct',
        '/categorize',
        completion.usage.prompt_tokens,
        completion.usage.completion_tokens
      );
    }
    
    return res.json({ 
      category,
      confidence: 0.85 // OpenAI doesn't provide confidence scores, so we use a placeholder
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    monitoring.recordApiError(error.name || 'UnknownError');
    return res.status(500).json({ error: 'Failed to categorize text' });
  }
});

// Start server
const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`OpenAI service running on port ${PORT}`);
}); 