# Mapty - Interactive Workout Tracker 🏃‍♂️🚴‍♀️

A modern, interactive web application that allows users to track their workouts (running and cycling) on an interactive map. Built with vanilla JavaScript and the Leaflet.js mapping library.

## 🌟 Features

- **Interactive Map Integration**: Click anywhere on the map to add a new workout
- **Dual Workout Types**: Support for both running and cycling activities
- **Automatic Calculations**: 
  - Running: Calculates pace (min/km)
  - Cycling: Calculates speed (km/h)
- **Persistent Storage**: Workouts are saved locally and persist between sessions
- **Workout Management**:
  - Edit existing workouts
  - Delete individual workouts
  - Reset all workouts
- **Smart Sorting**: Sort workouts by date, distance, duration, or pace/speed
- **Visual Markers**: Each workout appears as a popup marker on the map
- **Responsive Design**: Clean, modern UI that works on different screen sizes
- **Geolocation**: Automatically centers map on user's current location

## 🚀 Demo

Simply open `index.html` in your web browser to start using the application. The app will request location permission to center the map on your current position.

## 📁 Project Structure

```
Mapty/
├── index.html          # Main HTML structure
├── style.css           # CSS styles and layout
├── script.js           # JavaScript functionality
├── icon.png            # Browser favicon
└── logo.png            # Application logo
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS custom properties
- **Vanilla JavaScript (ES6+)**: 
  - Classes and inheritance
  - Local Storage API
  - Geolocation API
  - Event delegation
  - Array methods (map, filter, sort, forEach)
- **Leaflet.js**: Interactive mapping library
- **OpenStreetMap**: Map tiles and data
- **Google Fonts**: Manrope font family

## 🎯 Key Learning Outcomes

Through building this project, I gained experience with:

### JavaScript Concepts
- **Object-Oriented Programming**: Implemented class inheritance with `Workout`, `Running`, and `Cycling` classes
- **Application Architecture**: Organized code using the MVC (Model-View-Controller) pattern
- **Event Handling**: Complex event delegation and form management
- **Local Storage**: Persistent data storage and retrieval
- **Geolocation API**: Working with browser location services
- **Array Methods**: Advanced data manipulation and sorting algorithms

### CSS Techniques
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **CSS Custom Properties**: Maintainable color scheme and theming
- **Smooth Transitions**: Enhanced user experience with CSS animations
- **Responsive Design**: Mobile-first approach and fluid layouts

### Third-Party Integration
- **Leaflet.js**: Interactive map implementation and customization
- **External APIs**: Integration with mapping services and tile providers

### Best Practices
- **Code Organization**: Modular, maintainable code structure
- **Error Handling**: Input validation and user feedback
- **User Experience**: Intuitive interface and smooth interactions
- **Performance**: Efficient DOM manipulation and memory management

## 🚀 How to Use

1. **Allow Location Access**: Grant permission for the app to access your location
2. **Add a Workout**: Click anywhere on the map to open the workout form
3. **Fill Details**: Enter distance, duration, and activity-specific metrics
4. **View Workouts**: All workouts appear in the sidebar with calculated statistics
5. **Manage Workouts**: Edit, delete, or sort your workout collection
6. **Navigate**: Click on sidebar workouts to center the map on that location

## 💡 Future Enhancements

Potential improvements for this project:
- Weather data integration
- Workout route drawing
- Statistics and progress charts
- Social sharing features
- Export data functionality
- Multiple workout types (swimming, hiking, etc.)
- Performance analytics and goal setting

## 🎓 Educational Value

This project serves as an excellent introduction to:
- Modern JavaScript development patterns
- Working with external APIs and libraries
- Local data persistence
- Interactive web application development
- Object-oriented programming in JavaScript
- Real-world problem solving with code

## 📝 Credits

This project was built as part of Jonas Schmedtmann's JavaScript course, demonstrating practical application of advanced JavaScript concepts in a real-world scenario.

## 📄 License

This project is for educational purposes. Feel free to use it for learning or in your portfolio, but please don't use it for teaching or claim it as your own work.

---

*Built with ❤️ using vanilla JavaScript and modern web technologies*