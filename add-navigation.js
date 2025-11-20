const fs = require('fs');
const path = require('path');

// Function to add home button to HTML files
function addHomeButtonToGames() {
    const gamesDir = path.join(__dirname, 'html-css-javascript-games-main');
    
    // Read all game directories
    const gameFolders = fs.readdirSync(gamesDir).filter(folder => {
        return fs.statSync(path.join(gamesDir, folder)).isDirectory();
    });
    
    console.log(`Found ${gameFolders.length} game directories`);
    
    gameFolders.forEach((folder, index) => {
        const gamePath = path.join(gamesDir, folder);
        const indexPath = path.join(gamePath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            try {
                let content = fs.readFileSync(indexPath, 'utf8');
                
                // Add home button CSS if not present
                const homeButtonCSS = `
                    .home-button {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        z-index: 1000;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 14px;
                    }
                    
                    .home-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                    }
                    
                    .home-button i {
                        font-size: 16px;
                    }
                `;
                
                // Add Font Awesome if not present
                const fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
                
                if (!content.includes('font-awesome.com')) {
                    // Add Font Awesome before closing head tag
                    content = content.replace('</head>', `${fontAwesomeLink}\n</head>`);
                }
                
                // Add home button CSS before closing style tag or in head
                if (content.includes('</style>')) {
                    content = content.replace('</style>', `${homeButtonCSS}\n</style>`);
                } else if (content.includes('</head>')) {
                    content = content.replace('</head>', `<style>${homeButtonCSS}</style>\n</head>`);
                }
                
                // Add home button after body tag or at the beginning of body
                const homeButtonHTML = '<a href="../../../index.html" class="home-button"><i class="fas fa-home"></i> Home</a>';
                
                if (content.includes('<body>')) {
                    content = content.replace('<body>', `<body>\n${homeButtonHTML}`);
                } else if (content.includes('<body ')) {
                    // Handle body with attributes
                    const bodyMatch = content.match(/<body[^>]*>/);
                    if (bodyMatch) {
                        content = content.replace(bodyMatch[0], `${bodyMatch[0]}\n${homeButtonHTML}`);
                    }
                }
                
                fs.writeFileSync(indexPath, content);
                console.log(`✅ Added home button to ${folder}`);
                
            } catch (error) {
                console.error(`❌ Error processing ${folder}:`, error.message);
            }
        } else {
            console.warn(`⚠️ No index.html found in ${folder}`);
        }
    });
    
    console.log('\n🎮 Home navigation added to all games!');
}

// Run the script
addHomeButtonToGames();