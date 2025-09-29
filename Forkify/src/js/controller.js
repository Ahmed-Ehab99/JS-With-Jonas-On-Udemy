import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODAL_CLOSE_SEC } from "./config";
import * as model from "./model";
import addRecipeView from "./views/addRecipeView";
import bookmarkView from "./views/bookmarkView";
import paginationView from "./views/paginationView";
import recipeView from "./views/recipeView";
import resultsView from "./views/resultsView";
import searchView from "./views/searchView";

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Loading Spinner
    recipeView.renderSpinner();

    // Update Results View to Mark Selected Search Result
    resultsView.update(model.getSearchResultsPage());

    // Updating Bookmarks View
    bookmarkView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);

    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResultes = async function () {
  try {
    resultsView.renderSpinner();
    // Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // Load Search Results
    await model.loadSearchResult(query);

    // Render Results
    resultsView.render(model.getSearchResultsPage());

    // Render Initial Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render New Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the Recipe (in state)
  model.updateServings(newServings);

  // Update the Recipe View
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Loading Spinner
    addRecipeView.renderSpinner();

    // Upload the New Recipe Data
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHundlerUpdateServings(controlServings);
  recipeView.addHundlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResultes);

  paginationView.addHundlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
