//Task Two
// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });

//Task Three
// 1. Find books that are both in stock and published after 2010,
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { _id: 0, title: 1, author: 1, price: 1 }
);

// 2. Sort books by price in ascending order (lowest to highest)
db.books.find( {},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: 1 });

// 3. Sort books by price in descending order (highest to lowest)
db.books.find({},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: -1 });

// 4. Pagination: Get page 1 (first 5 books by price ascending)
db.books.find({},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: 1 }).skip(0).limit(5);

//    Pagination: Get page 2 (next 5 books by price ascending)
db.books.find({},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: 1 }).skip(5).limit(5);

//Task Four
// 1. Calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] },
      count: 1
    }
  }
]);

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 },
  {
    $project: {
      _id: 0,
      author: "$_id",
      bookCount: 1
    }
  }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      decade: "$_id",
      count: 1
    }
  },
  { $sort: { decade: 1 } }
]);

// Task 5: Indexing
// 1. Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 });

// 2. Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 });

// 3. Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");