const fs = require('fs');

// Read the file
const filePath = 'c:\\flutter_projects\\SmartKitchen AI\\backend\\src\\controllers\\recipeController.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the compressed line
const oldLine = "      const lang = language === 'te' ? 'te' : 'en'; const recipes = fallbackRecipes[lang]; let template = recipes.rice; // default";

const newLines = `      // Determine language (default to English)
      const lang = language === 'te' ? 'te' : 'en';
      console.log('Selected language for recipe:', lang);
      const recipes = fallbackRecipes[lang];
      
      // Use fallback recipe based on first ingredient
      let template = recipes.rice; // default`;

content = content.replace(oldLine, newLines);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully!');
