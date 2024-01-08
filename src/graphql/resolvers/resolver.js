const {books,authors} = require('../data/static')
const resolvers = {
    Query: {
        books: () => books,
        authors: () => authors,
        // book: (parent, args) =>
        //     books.find((book) => book.id == args.id),
        // author: (parent, args,data) => {
        //     return query.getAuthorById(args.id,data)
        // },
    },
    // Book: {
    //     author: (parent, args,data) => query.getAuthorById(parent.authorId,data),
    // },
    // Author: {
    //     books: (parent, args,data) => query.getBooks(parent.books,data)
    // },

    // Mutation: {
    //     createAuthor: (parent, args,data) => mutation.createAuthor(args,data),
    //     updateAuthor: (parent, args,data) => mutation.updateAuthor(args,data),
    // }
}

module.exports = resolvers;
