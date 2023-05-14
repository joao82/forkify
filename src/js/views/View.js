import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /** Documentation for render method
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {§} data
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Joao
   * @todo Finish implementation
   */
  // 1) rendering the recipe
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // 2) update DOM only with the changed part
  update(data, render = true) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    if (!render) return markup;

    // step1: convert string to DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // step2: convert DOM object to array
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // step3: convert DOM object to array
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));

    // step4:
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // console.log(currEl, newEl.isEqualNode(currEl));

      // step5: update changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        currEl.textContent = newEl.textContent;
      }

      // step6: update changed attributes
      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // 3) clear text context
  _clear() {
    this._parentEl.innerHTML = '';
  }

  // 4) spinning until load is complete
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // 5) error message rendering
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // 5) message rendering
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
