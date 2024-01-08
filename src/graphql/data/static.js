const books = [
    { id: 1, name: 'Cuốn sách 1', genre: 'Thể loại 1', authorId: 1 },
    { id: 2, name: 'Cuốn sách 2', genre: 'Thể loại 2', authorId: 2 },
    { id: 3, name: 'Cuốn sách 3', genre: 'Thể loại 1', authorId: 3 },
    { id: 4, name: 'Cuốn sách 4', genre: 'Thể loại 3', authorId: 4 },
    { id: 5, name: 'Cuốn sách 5', genre: 'Thể loại 2', authorId: 5 },
    { id: 6, name: 'Cuốn sách 6', genre: 'Thể loại 1', authorId: 6 },
    { id: 7, name: 'Cuốn sách 7', genre: 'Thể loại 3', authorId: 7 },
    { id: 8, name: 'Cuốn sách 8', genre: 'Thể loại 2', authorId: 8 },
    { id: 9, name: 'Cuốn sách 9', genre: 'Thể loại 1', authorId: 9 },
    { id: 10, name: 'Cuốn sách 10', genre: 'Thể loại 3', authorId: 10 },
];

const authors = [
    { id: 1, name: 'Tác giả 1', age: 25, books: [1, 6, 9] },
    { id: 2, name: 'Tác giả 2', age: 30, books: [2, 5, 8] },
    { id: 3, name: 'Tác giả 3', age: 35, books: [3, 6, 9] },
    { id: 4, name: 'Tác giả 4', age: 40, books: [4, 7, 10] },
    { id: 5, name: 'Tác giả 5', age: 28, books: [5, 8] },
    { id: 6, name: 'Tác giả 6', age: 32, books: [1, 6] },
    { id: 7, name: 'Tác giả 7', age: 38, books: [3, 7] },
    { id: 8, name: 'Tác giả 8', age: 42, books: [2, 5, 8] },
    { id: 9, name: 'Tác giả 9', age: 29, books: [1, 9] },
    { id: 10, name: 'Tác giả 10', age: 33, books: [4, 10] },
];

module.exports = { books, authors };
