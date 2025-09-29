import View from "./View";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was Successfully Uploades :)";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");

  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();

      const form = e.currentTarget;
      const dataArray = [...new FormData(form)];
      const data = Object.fromEntries(dataArray);

      // Validate ingredient fields: "Quantity,Unit,Description"
      const ingredientEntries = Object.entries(data).filter(([key, value]) =>
        key.startsWith("ingredient")
      );

      const errors = [];
      const cleanedIngredients = [];

      ingredientEntries.forEach(([key, value]) => {
        if (!value || value.trim() === "") return; // allow empty optional rows

        const parts = value.split(",").map((p) => p.trim());
        if (parts.length !== 3) {
          errors.push(
            `${key} must have exactly 3 parts: Quantity,Unit,Description`
          );
          return;
        }

        const [quantityRaw, unit, description] = parts;

        if (!description) {
          errors.push(`${key} description is required`);
        }

        // quantity may be empty -> null, else must be a valid number
        let quantity = null;
        if (quantityRaw !== "") {
          const num = Number(quantityRaw.replace(" ", ""));
          if (!Number.isFinite(num) || num < 0) {
            errors.push(
              `${key} quantity must be a non-negative number or empty`
            );
          } else {
            quantity = num;
          }
        }

        cleanedIngredients.push({ quantity, unit, description });
      });

      if (errors.length > 0 || cleanedIngredients.length === 0) {
        const message =
          errors.length > 0
            ? `Please fix the following:\n- ${errors.join("\n- ")}`
            : "Please add at least one valid ingredient";
        this.renderError(message);
        return;
      }

      // Replace raw ingredient strings with cleaned values so model can use them directly
      cleanedIngredients.forEach((ing, idx) => {
        data[`ingredient-${idx + 1}`] = `${ing.quantity ?? ""},${ing.unit},${
          ing.description
        }`;
      });

      // Clear any extra ingredient-* fields beyond cleaned ones
      Object.keys(data)
        .filter(
          (k) =>
            k.startsWith("ingredient-") &&
            Number(k.split("-")[1]) > cleanedIngredients.length
        )
        .forEach((k) => delete data[k]);

      handler(data);
    });
  }
}

export default new AddRecipeView();
