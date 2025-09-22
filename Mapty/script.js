"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const btnReset = document.querySelector(".btn-reset");
const sortSelect = document.querySelector(".sort-select");

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/min
    return this.speed;
  }
}

// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapZoomLevel = 15;
  #mapEvent;
  #workouts = [];
  #editingWorkout = null;
  #markers = new Map();

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    // Wait for DOM to be fully loaded before attaching event listeners
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this._attachEventListeners();
      });
    } else {
      this._attachEventListeners();
    }
  }

  _attachEventListeners() {
    form.addEventListener("submit", this._handleFormSubmit.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener(
      "click",
      this._handleWorkoutClick.bind(this)
    );
    if (btnReset) {
      btnReset.addEventListener("click", this._resetWorkouts.bind(this));
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", this._sortWorkouts.bind(this));
    }
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert("Could not get your position");
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#workouts.forEach((workout) => {
      this._renderWorkout(workout);
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE) {
    if (this.#editingWorkout) return;

    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    this._clearForm();
    this.#editingWorkout = null;
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _clearForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    if (this.#editingWorkout) {
      this._updateWorkout();
    } else {
      this._createWorkout();
    }
  }

  _createWorkout(e) {
    // Get Data from Form
    const type = inputType.value;
    const distance = +inputDistance.value; // Converted to Number
    const duration = +inputDuration.value; // Converted to Number
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (!this._validateInputs(distance, duration)) return;

    // If Workout Running, Create Running Object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // Check is Data is Valid
      if (
        !this._validateInputs(cadence) ||
        !this._allPositive(distance, duration, cadence)
      ) {
        return alert("Inputs have to be positive numbers");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If Workout Cycling, Create Cycling Object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // Check is Data is Valid
      if (
        !this._validateInputs(elevation) ||
        !this._allPositive(distance, duration)
      ) {
        return alert("Inputs have to be positive numbers");
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }

  _updateWorkout() {
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    if (!this._validateInputs(distance, duration)) return;

    const workout = this.#editingWorkout;
    workout.distance = distance;
    workout.duration = duration;
    workout.type = type;

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !this._validateInputs(cadence) ||
        !this._allPositive(distance, duration, cadence)
      ) {
        return alert("Inputs have to be positive numbers");
      }
      workout.cadence = cadence;
      delete workout.elevationGain;
      workout.calcPace();
    } else {
      const elevation = +inputElevation.value;
      if (
        !this._validateInputs(elevation) ||
        !this._allPositive(distance, duration)
      ) {
        return alert("Inputs have to be positive numbers");
      }
      workout.elevationGain = elevation;
      delete workout.cadence;
      workout.calcSpeed();
    }

    workout._setDescription();
    this._renderAllWorkouts();
    this._hideForm();
    this._setLocalStorage();
  }

  _validateInputs(...inputs) {
    return inputs.every((inp) => Number.isFinite(inp));
  }

  _allPositive(...inputs) {
    return inputs.every((inp) => inp > 0);
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();

    this.#markers.set(workout.id, marker);
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">
          ${workout.description}
          <div class="workout__actions">
              <button class="btn-edit" data-id="${workout.id}">✏️</button>
              <button class="btn-delete" data-id="${workout.id}">🗑️</button>
          </div>
        </h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

    if (workout.type === "running") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">s/m</span>
        </div>`;
    }

    if (workout.type === "cycling") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>`;
    }

    html += "</li>";
    form.insertAdjacentHTML("afterend", html);
  }

  _renderAllWorkouts() {
    containerWorkouts.querySelectorAll(".workout").forEach((el) => el.remove());

    this.#markers.forEach((marker) => marker.remove());
    this.#markers.clear();

    this.#workouts.forEach((workout) => {
      this._renderWorkout(workout);
      this._renderWorkoutMarker(workout);
    });
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;

    const workoutId = workoutEl.dataset.id;
    const workout = this.#workouts.find((work) => work.id === workoutId);

    if (e.target.classList.contains("btn-edit")) {
      this._editWorkout(workout);
    } else if (e.target.classList.contains("btn-delete")) {
      this._deleteWorkout(workoutId);
    } else {
      this._moveToPopup(workout);
    }
  }

  _editWorkout(workout) {
    this.#editingWorkout = workout;

    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    if (workout.type === "running") {
      inputCadence.value = workout.cadence;
      inputElevation.value = "";
    } else {
      inputElevation.value = workout.elevationGain;
      inputCadence.value = "";
    }

    this._toggleElevationField();
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _deleteWorkout(workoutId) {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    const marker = this.#markers.get(workoutId);
    if (marker) {
      marker.remove();
      this.#markers.delete(workoutId);
    }

    this.#workouts = this.#workouts.filter(
      (workout) => workout.id !== workoutId
    );
    this._renderAllWorkouts();
    this._setLocalStorage();
  }

  _moveToPopup(workout) {
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _sortWorkouts() {
    const sortBy = sortSelect.value;

    this.#workouts.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return b.distance - a.distance;
        case "duration":
          return b.duration - a.duration;
        case "pace":
          const aPace = a.type === "running" ? a.pace : a.speed;
          const bPace = b.type === "running" ? b.pace : b.speed;
          return a.type === "running" ? aPace - bPace : bPace - aPace;
        case "date":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    this._renderAllWorkouts();
    this._setLocalStorage();
  }

  _resetWorkouts() {
    if (
      !confirm(
        "Are you sure you want to remove ALL workouts? This cannot be undone."
      )
    )
      return;

    this.#markers.forEach((marker) => marker.remove());
    this.#markers.clear();
    this.#workouts = [];
    this._renderAllWorkouts();
    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;

    this.#workouts = data.map((workoutData) => {
      let workout;
      if (workoutData.type === "running") {
        workout = new Running(
          workoutData.coords,
          workoutData.distance,
          workoutData.duration,
          workoutData.cadence
        );
      } else {
        workout = new Cycling(
          workoutData.coords,
          workoutData.distance,
          workoutData.duration,
          workoutData.elevationGain
        );
      }

      workout.id = workoutData.id;
      workout.date = new Date(workoutData.date);
      workout._setDescription();
      return workout;
    });
  }
}

new App();
