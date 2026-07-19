import { fetchBooks, validateBook } from '@/services/api.service';
import { defineStore } from 'pinia';

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],
  }),
  getters: {
    getFavoriteBooks: (state) => state.books.filter((book) => book.favorite),
    getBookByIsbn: (state) => (isbn) => state.books.find((book) => book.isbn === isbn),
  },
  actions: {
    async loadBooks() {
      this.books = await fetchBooks()
    },
    createBook(newBook) {
      validateBook(newBook);
      this.books.push(newBook)

      pendo.track("book_created", {
        isbn: newBook.isbn,
        title: newBook.title,
        pageCount: newBook.pageCount,
        authorCount: newBook.authors ? newBook.authors.length : 0,
        categoryCount: newBook.categories ? newBook.categories.length : 0,
        favorite: newBook.favorite,
      });
    },
    updateBook(isbn, updatedBook) {
      validateBook(updatedBook);
      const index = this.books.findIndex((book) => book.isbn === isbn)
      const previousFavorite = this.books[index]?.favorite
      this.books[index] = updatedBook

      if (previousFavorite !== undefined && previousFavorite !== updatedBook.favorite) {
        pendo.track("book_favorite_toggled", {
          isbn: updatedBook.isbn,
          title: updatedBook.title,
          isFavorite: updatedBook.favorite,
        });
      }

      pendo.track("book_updated", {
        isbn: updatedBook.isbn,
        title: updatedBook.title,
        pageCount: updatedBook.pageCount,
        authorCount: updatedBook.authors ? updatedBook.authors.length : 0,
        categoryCount: updatedBook.categories ? updatedBook.categories.length : 0,
      });
    },
    deleteBook(isbn) {
      this.books = this.books.filter((book) => book.isbn !== isbn)

      pendo.track("book_deleted", {
        isbn: isbn,
      });
    },
  },
})
