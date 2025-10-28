const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '..', 'src', 'app', 'environments');

// Copy template files if environment files don't exist
const files = [
  { template: 'environment.template.ts', target: 'environment.ts' },
  { template: 'environment.prod.template.ts', target: 'environment.prod.ts' },
];

files.forEach(({ template, target }) => {
  const templatePath = path.join(envDir, template);
  const targetPath = path.join(envDir, target);

  // Only copy if target doesn't exist
  if (!fs.existsSync(targetPath) && fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, targetPath);
    console.log(`✓ Created ${target} from ${template}`);
  } else if (fs.existsSync(targetPath)) {
    console.log(`✓ ${target} already exists`);
  } else {
    console.log(`⚠ Template ${template} not found`);
  }
});

console.log('Environment setup complete!');
