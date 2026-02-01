const fs = require('fs');

const filePath = 'c:\\flutter_projects\\SmartKitchen AI\\backend\\src\\controllers\\recipeController.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the generatedRecipe assignment
const oldCode = `      generatedRecipe = {
        ...template,
        title: \`\${template.title} (Using \${ingredients.join(', ')})\`,
      };`;

const newCode = `      // Create dynamic ingredients list from user's input
      const dynamicIngredients = ingredients.map((ing, idx) => ({
        name: ing,
        quantity: idx === 0 ? 2 : 1,
        unit: idx === 0 ? (lang === 'te' ? 'కప్పులు' : 'cups') : (lang === 'te' ? 'ముక్కలు' : 'pieces')
      }));
      
      // Add basic seasonings
      dynamicIngredients.push(
        { name: lang === 'te' ? 'నూనె' : 'oil', quantity: 2, unit: lang === 'te' ? 'టేబుల్‌స్పూన్లు' : 'tablespoons' },
        { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 1, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' }
      );
      
      generatedRecipe = {
        ...template,
        title: \`\${template.title} with \${ingredients.join(', ')}\`,
        description: lang === 'te' 
          ? \`\${ingredients.join(', ')} ఉపయోగించి త్వరగా మరియు సులభంగా వంటకం\`
          : \`A quick and easy recipe using \${ingredients.join(', ')}\`,
        ingredients: dynamicIngredients,
      };`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Recipe controller updated successfully!');
console.log('✅ Recipes will now include ALL selected ingredients');
