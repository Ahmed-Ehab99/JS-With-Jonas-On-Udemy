import icons from "url:../../img/icons.svg";
import View from "./View";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHundlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkupButton(page, type) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--${type}" data-goto="${page}">
        ${
          type === "prev"
            ? `
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${page}</span>
            `
            : `
              <span>Page ${page}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            `
        }
      </button>
    `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const pageInfo = `<span class="pagination__info">Page ${currentPage} of ${numPages}</span>`;

    // First Pagee, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        ${pageInfo}
        ${this._generateMarkupButton(currentPage + 1, "next")}
      `;
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return `
        ${this._generateMarkupButton(currentPage - 1, "prev")}
        ${pageInfo}
      `;
    }

    // Other page
    if (currentPage < numPages) {
      return `
        ${this._generateMarkupButton(currentPage - 1, "prev")}
        ${pageInfo}
        ${this._generateMarkupButton(currentPage + 1, "next")}
      `;
    }

    // First Page, and there are no other pages
    return pageInfo;
  }
}

export default new PaginationView();
