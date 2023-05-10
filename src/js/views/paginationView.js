import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; // + converts string to number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(currPage);
    // console.log(numPages);

    // pag 1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
          <button data-goto="${
            currPage + 1
          }" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // last page
    if (currPage === numPages && numPages > 1) {
      return `
          <button data-goto="${
            currPage - 1
          }" class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${currPage - 1}</span>
         </button>
       `;
    }

    //  other pages
    if (currPage < numPages) {
      return `
          <button data-goto="${
            currPage - 1
          }" class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${currPage - 1}</span>
         </button>
         <button data-goto="${
           currPage + 1
         }" class="btn--inline pagination__btn--next">
           <span>Page ${currPage + 1}</span>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
           </svg>
         </button>
       `;
    }
    // pag 1 only
    return '';
  }
}

export default new PaginationView();
