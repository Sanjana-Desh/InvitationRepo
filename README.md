# Senior Farewell Celebration Website

## Overview
This project is an interactive web-based invitation for a Senior Farewell Celebration. It features an engaging mini-game that seniors must complete to access their personalized invitation. Once the game is completed, the senior will see their personal invitation with their photo highlighted.

## Features
- **Interactive Challenge Game**: A mini-game where users control a character to collect targets while avoiding obstacles
- **Personalized Invitations**: Each senior receives a unique link that displays their own photo
- **Responsive Design**: Works on both desktop and mobile devices
- **Event Details**: Comprehensive information about the farewell celebration

## How It Works
1. Seniors receive a personalized link with their ID embedded in the URL
2. They play a mini-game ("Hard Challenge") to unlock their invitation
3. Upon completing the game (or using a bypass link), they see their personalized invitation

## Setup Instructions

### Prerequisites
- Web server or hosting service
- Basic understanding of HTML, CSS, and JavaScript

### Installation
1. Download all the project files to your computer
2. Upload the files to your web hosting service
3. Ensure all files are in the same directory

### Configuration
1. **Update Senior Information**:
   - Replace placeholder images with actual senior photos
   - Update names and quotes for each senior
   - Make sure each senior's photo has the correct ID (e.g., `senior-a-photo`, `senior-b-photo`)

2. **Update Event Details**:
   - Modify the date, time, venue, and dress code information
   - Update any additional event information as needed

## Creating Personalized Links
Each senior should receive a personalized link with their specific ID:

- Senior A: `https://yourwebsite.com/index.html?id=a`
- Senior B: `https://yourwebsite.com/index.html?id=b`
- Senior C: `https://yourwebsite.com/index.html?id=c`
- Senior D: `https://yourwebsite.com/index.html?id=d`

### Game Bypass Option
For seniors who may have difficulty with the game, you can provide a direct link that bypasses the game:

`https://yourwebsite.com/index.html?id=a&showInvitation=true`

## Usage Tips

### Sending Invitations
1. Create a personalized message for each senior
2. Include their unique link in the message
3. Send via email, text message, or social media

### Example Message:
```
Dear [Senior Name],

We've created a special interactive farewell invitation just for you!
Click on this personal link to access your invitation:
[Their personalized link]

You'll need to complete a fun challenge to unlock your invitation. 
(Hint: Use arrow keys to move and collect 15 red dots!)

We can't wait to celebrate with you!

Best regards,
[Your Name]
```

## Customization Options
- Change colors and fonts in the CSS section
- Adjust game difficulty by modifying parameters in the JavaScript code
- Add more senior cards as needed

## Troubleshooting
- **Game not working**: Ensure JavaScript is enabled in the browser
- **Photos not loading**: Check file paths and image formats
- **Link not personalizing**: Verify URL parameters are correctly formatted

## License
This project is available for personal and educational use. Please credit the original author if redistributing or modifying.

---

Created with ❤️ for our graduating seniors
