import previewView from './previewView';
import View from './View';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'We could not find your recipe. Please try again!';
  _message = 'blablablaba';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
