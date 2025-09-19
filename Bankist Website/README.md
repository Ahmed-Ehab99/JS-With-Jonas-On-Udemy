# 🏦 Bankist - Modern Banking Website

A modern, responsive banking website built with vanilla HTML, CSS, and JavaScript. This project demonstrates advanced frontend techniques including smooth scrolling, lazy loading, intersection observers, and mobile-first responsive design.

![Bankist Website Preview](img/hero.png)

## ✨ Features

### 🎨 **Modern Design**

- Clean, minimalist interface
- Smooth animations and transitions
- Beautiful color scheme with CSS custom properties
- Professional typography using Google Fonts (Poppins)

### 📱 **Fully Responsive**

- Mobile-first approach
- Responsive breakpoints for all device sizes
- Hamburger menu for mobile navigation
- Touch-friendly interface elements
- Optimized layouts for tablets and smartphones

### ⚡ **Advanced JavaScript Features**

- **Smooth Scrolling Navigation**: Seamless section-to-section navigation
- **Intersection Observer API**: Efficient scroll-triggered animations
- **Lazy Loading**: Optimized image loading for better performance
- **Modal System**: Professional account opening modal with form validation
- **Tabbed Interface**: Interactive operations section
- **Image Slider**: Custom testimonial carousel with navigation controls
- **Sticky Navigation**: Navigation bar that sticks on scroll
- **Mobile Navigation**: Animated hamburger menu for mobile devices

### 🔧 **Technical Highlights**

- **Modular JavaScript Architecture**: Well-organized, maintainable code
- **Performance Optimized**: Efficient event handling and DOM manipulation
- **Accessibility Features**: ARIA labels, keyboard navigation, focus management
- **SEO Optimized**: Meta tags, semantic HTML, proper heading structure
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone or download the project**

   ```bash
   git clone https://github.com/yourusername/bankist-website.git
   cd bankist-website
   ```

2. **Open the project**

   - Simply open `index.html` in your web browser, or
   - Use a local development server for best experience:

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js (http-server)
     npx http-server

     # Using VS Code Live Server extension
     ```

3. **Access the website**
   - Direct file: `file:///path/to/bankist-website/index.html`
   - Local server: `http://localhost:8000`

## 📁 Project Structure

```
Bankist Website/
├── index.html              # Main HTML file
├── style.css              # Stylesheet with responsive design
├── script.js              # JavaScript functionality
├── README.md              # This file
└── img/                   # Image assets
    ├── logo.png           # Bankist logo
    ├── icon.png           # Favicon
    ├── hero.png           # Hero section image
    ├── digital.jpg        # Features section images
    ├── grow.jpg
    ├── card.jpg
    ├── user-1.jpg         # Testimonial photos
    ├── user-2.jpg
    ├── user-3.jpg
    └── icons.svg          # SVG icon sprite
```

## 🎯 Key Components

### 1. **Header & Navigation**

- Responsive navigation bar
- Smooth scrolling to sections
- Mobile hamburger menu
- Sticky navigation on scroll

### 2. **Hero Section**

- Compelling headline with gradient highlights
- Call-to-action button
- Hero image with lazy loading

### 3. **Features Section**

- Three-column feature showcase
- Lazy-loaded images
- Icon-based feature presentation

### 4. **Operations Section**

- Interactive tabbed interface
- Three operation types (Transfers, Loans, Closing)
- Smooth tab transitions

### 5. **Testimonials Section**

- Image slider with navigation controls
- Customer testimonials with photos
- Keyboard navigation support
- Dot indicators

### 6. **Modal System**

- Account opening form
- Form validation
- Keyboard accessibility (ESC to close)
- Backdrop blur effect

### 7. **Footer**

- Navigation links
- Copyright information
- Social media links

## 🛠️ Technologies Used

- **HTML5**: Semantic markup, accessibility features
- **CSS3**:
  - Flexbox and Grid layouts
  - CSS Custom Properties (variables)
  - Media queries for responsiveness
  - CSS animations and transitions
  - Backdrop filters
- **Vanilla JavaScript**:
  - ES6+ features (arrow functions, const/let, template literals)
  - Intersection Observer API
  - Event delegation
  - DOM manipulation
  - Form handling

## 📱 Responsive Breakpoints

- **Desktop**: 1025px and above
- **Large Tablets**: 769px - 1024px
- **Tablets**: 481px - 768px
- **Mobile**: 320px - 480px
- **Extra Small**: Below 320px

## 🎨 Color Palette

```css
:root {
  --color-primary: #5ec576; /* Main green */
  --color-secondary: #ffcb03; /* Yellow */
  --color-tertiary: #ff585f; /* Red */
  --color-primary-darker: #4bbb7d;
  --color-secondary-darker: #ffbb00;
  --color-tertiary-darker: #fd424b;
}
```

## ⚡ Performance Features

- **Lazy Loading**: Images load only when needed
- **Efficient Event Handling**: Event delegation and debouncing
- **Optimized Animations**: CSS transforms for smooth performance
- **Minimal Dependencies**: No external JavaScript libraries
- **Optimized Images**: Proper image sizing and formats

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 SEO Features

- Semantic HTML5 structure
- Meta tags for social sharing
- Open Graph tags
- Twitter Card meta tags
- Proper heading hierarchy
- Alt text for all images
- Descriptive link text

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: (none needed for static site)
3. Set publish directory: `/Bankist Website`
4. Deploy!

### GitHub Pages

1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch
4. Your site will be available at `https://username.github.io/repository-name`

### Other Hosting Options

- Vercel
- Firebase Hosting
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style
2. Test on multiple devices and browsers
3. Ensure accessibility standards are met
4. Optimize for performance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Design**: Inspired by Jonas Schmedtmann's JavaScript course
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Poppins)
- **Images**: High-quality stock photos

## 📞 Support

If you have any questions or need help with this project, please:

1. Check the [Issues](https://github.com/yourusername/bankist-website/issues) section
2. Create a new issue with detailed description
3. Contact the maintainer

## 🌟 Star History

If you found this project helpful, please give it a star ⭐!

---

**Made with ❤️ for learning and portfolio purposes**

_This project demonstrates modern web development practices and serves as a great example of a professional banking website built with vanilla web technologies._
