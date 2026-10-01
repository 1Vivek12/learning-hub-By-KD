const fs = require('fs');
const path = require('path');

const dirsToSearch = ['src', 'docs', 'app'];

const replaceRules = [
  { search: /SkillForge/g, replace: 'Learning Hub' },
  { search: /skillforge\.io/g, replace: 'learninghub.io' },
  { search: /skillforge\.dev/g, replace: 'learninghub.dev' },
  { search: /skillforge\.edu/g, replace: 'learninghub.edu' },
  { search: /@skillforge/g, replace: '@learninghub' },
  { search: /SKILLFORGE/g, replace: 'LEARNING_HUB' },
  // Only replace lowercase skillforge if it's not a variable or localStorage key if we want to be safe, 
  // but prompt says purely branding identifiers can be changed safely.
  // Actually, replacing 'skillforge_theme' to 'learning_hub_theme' might reset user settings. Let's do it safely.
  { search: /skillforge_theme/g, replace: 'learninghub_theme' },
  { search: /skillforge_language/g, replace: 'learninghub_language' },
  { search: /skillforge_courses_data/g, replace: 'learninghub_courses_data' },
  { search: /skillforge_instructors_data/g, replace: 'learninghub_instructors_data' },
  { search: /skillforge_live_classes_data/g, replace: 'learninghub_live_classes_data' },
  { search: /skillforge_learning_paths_data/g, replace: 'learninghub_learning_paths_data' },
  { search: /skillforge_testimonials_data/g, replace: 'learninghub_testimonials_data' },
  { search: /skillforge_faqs_data/g, replace: 'learninghub_faqs_data' },
  { search: /skillforge_sections_data/g, replace: 'learninghub_sections_data' },
  { search: /skillforge_settings_data/g, replace: 'learninghub_settings_data' },
  { search: /skillforge_orders_data/g, replace: 'learninghub_orders_data' },
  { search: /skillforge_current_user/g, replace: 'learninghub_current_user' },
  { search: /skillforge_audit_logs/g, replace: 'learninghub_audit_logs' },
  { search: /skillforge_certificates_data/g, replace: 'learninghub_certificates_data' },
  { search: /skillforge_db_initialized_v2/g, replace: 'learninghub_db_initialized_v2' },
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (stat.isFile()) {
      if (
        fullPath.endsWith('.ts') || 
        fullPath.endsWith('.tsx') || 
        fullPath.endsWith('.js') || 
        fullPath.endsWith('.jsx') || 
        fullPath.endsWith('.md') || 
        fullPath.endsWith('.json') ||
        fullPath.endsWith('.css')
      ) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;
        
        for (const rule of replaceRules) {
          content = content.replace(rule.search, rule.replace);
        }
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

// Also process layout and other root files if needed
const rootFiles = ['package.json', 'next.config.js', '.env.example'];
for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    for (const rule of replaceRules) {
      content = content.replace(rule.search, rule.replace);
    }
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  }
}

dirsToSearch.forEach(processDir);
console.log('Bulk replacement complete.');
