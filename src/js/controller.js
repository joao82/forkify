import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';

///////////////////////////////////////
// https://forkify-api.herokuapp.com/v2

// Control the Recipes
const controlRecipes = async () => {
  try {
    // extract the id from the url endpoint
    const id = window.location.hash.slice(1);

    // check if there is id
    if (!id) return;

    // render the spinner while loading the recipe
    recipeView.renderSpinner();

    // STEP 0: update the results/bookmarks view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    // STEP 1: Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // STEP 2: if there is an id, fetch the data of that id from API
    await model.loadRecipe(id);
    // console.log(model.state.recipe);

    // STEP 3: Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // catch the error
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async () => {
  try {
    // STEP 1: Render the spinner
    resultsView.renderSpinner();

    // STEP 2: Get the query from the view
    const query = searchView.getQuery();
    if (!query) return;

    // STEP 3: Load the search results
    await model.loadSearchResults(query);
    console.log(model.state.search.results);

    // STEP 4: Render the results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // STEP 5:render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = goToPage => {
  // STEP 1: Render NEW the results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // STEP 2:render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // STEP 1: Update the recipe servings (in state)
  model.updateServings(newServings);

  // STEP 2: Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // STEP 1: Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else model.deleteBookMark(model.state.recipe.id);
  // console.log(model.state.recipe);

  // STEP 2: Update the recipe view
  recipeView.update(model.state.recipe);

  // STEP 3: Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render the recipe uploaded to the DOM
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change the ID in the URL
    // window.history.pushState() allows to change without reload the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥🔥🔥🔥', err); // cntl + cmd + space
    addRecipeView.renderError(err.message);
  }
};

// Init function
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
