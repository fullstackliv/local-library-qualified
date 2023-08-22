function getTotalBooksCount(books) {
  //use helperfunction to easily count books
  return arrayItemCount(books);
}

function getTotalAccountsCount(accounts) {
  //use helperfunction to easily count accounts
  return arrayItemCount(accounts);
}

function getBooksBorrowedCount(books) {
  //use reduce to iterate through each book in books
  return books.reduce((borrowCount, { borrows }) => {
    //If the most recent transaction in borrows has not been returned, then increase the total borrow counter.
    const mostRecent = borrows[0];
    if (!mostRecent.returned) borrowCount++;
    return borrowCount;
  }, 0);
}

function getMostCommonGenres(books) {
  //Use __sortNSlice helper function to sort by highest and truncate to just top 5
  return _sortNSlice(
    books
      //iterate through each book in books
      .reduce((genres, book) => {
        //check the array we are currently constructing to see if we already have this genre
        const matchingGenre = genres.find((genre) => genre.name === book.genre);
        //if we don't have a match, push it into our genres array with count 1, otherwise increase the current count by 1
        !matchingGenre
          ? genres.push({ name: book.genre, count: 1 })
          : matchingGenre.count++;
        return genres;
      }, [])
  );
}

function getMostPopularBooks(books) {
  //Use _sortNSlice helper function to sort by highest and truncate to just top 5
  return _sortNSlice(
    //map through each book in books
    books.map(({ title, borrows }) => ({
      name: title, //name is the title of the book we deconstructed
      count: arrayItemCount(borrows),
    }))
  );
}

function getMostPopularAuthors(books, authors) {
  //Use _sortNSlice helper function to sort by highest and truncate to just top 5
  return _sortNSlice(
    //map through each author in authors
    authors.map(({ name: { first, last }, id }) => ({
      name: `${first} ${last}`, //name is just our current author's name
      count: _authorBorrows(books, id), //uses helper function to determine the number of times this authorId is found in each book's borrows arrays
    }))
  );
}

//helper function to sort and truncate to just first 5 items
function _sortNSlice(arr, slicer = 5) {
  const newArr = [...arr];
  return newArr
    .sort(({ count: count1 }, { count: count2 }) => count2 - count1)
    .slice(0, slicer);
}

//helper function to more cleanly determine each author's total number of borrows across all books
function _authorBorrows(books, id) {
  return books.reduce((totalBorrows, { authorId, borrows }) => {
    if (authorId === id) totalBorrows += arrayItemCount(borrows);
    return totalBorrows;
  }, 0);
}

//helper function to easily count up any type of item array based on the length of said array
function arrayItemCount(item) {
  return item.length;
}

module.exports = {
  getTotalBooksCount,
  getTotalAccountsCount,
  getBooksBorrowedCount,
  getMostCommonGenres,
  getMostPopularBooks,
  getMostPopularAuthors,
};