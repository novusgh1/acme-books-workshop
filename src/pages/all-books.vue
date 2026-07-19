<template>
    <div>
        <h1>All Books</h1>
        <v-text-field
          v-model="search"
          label="Search books"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
        <!-- add the vuetify data table component here! -->
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();
const search = ref('');

let searchDebounceTimer = null;

watch(search, (query) => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const searchTerm = (query || '').trim();
    if (searchTerm.length > 0) {
      const resultsCount = bookStore.books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;

      pendo.track("book_search_executed", {
        query: searchTerm,
        resultsCount: resultsCount,
        totalBooks: bookStore.books.length,
      });
    }
  }, 500);
});
</script>
