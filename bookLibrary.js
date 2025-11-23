
export class BookLibrary {
  constructor() {
    this.books = [];
    this.nextId = 1;
  }

  

  
   
  addBook(title, author, year) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Название книги обязательно и должно быть непустой строкой');
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
      throw new Error('Автор книги обязателен и должен быть непустой строкой');
    }

    if (typeof year !== 'number' || !Number.isInteger(year) || year < 0 || year > new Date().getFullYear()) {
      throw new Error('Год издания должен быть положительным целым числом не больше текущего года');
    }

    const book = {
      id: this.nextId++,
      title: title.trim(),
      author: author.trim(),
      year: year,
      isRead: false,
      addedDate: new Date().toISOString().split('T')[0] 
    };

    this.books.push(book);
    return { ...book }; 
  }


  removeBook(bookId) {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== bookId);
    
    if (this.books.length === initialLength) {
      throw new Error(`Книга с ID ${bookId} не найдена`);
    }
  }


  findBooksByAuthor(author) {
    if (!author || typeof author !== 'string') {
      return [];
    }

    const searchTerm = author.toLowerCase().trim();
    return this.books.filter(book => 
      book.author.toLowerCase().includes(searchTerm)
    ).map(book => ({ ...book })); // Возвращаем копии
  }


  findBooksByTitle(title) {
    if (!title || typeof title !== 'string') {
      return [];
    }

    const searchTerm = title.toLowerCase().trim();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm)
    ).map(book => ({ ...book }));
  }

  markAsRead(bookId) {
    const book = this.books.find(book => book.id === bookId);
    
    if (!book) {
      throw new Error(`Книга с ID ${bookId} не найдена`);
    }

    if (book.isRead) {
      throw new Error(`Книга "${book.title}" уже отмечена как прочитанная`);
    }

    book.isRead = true;
    book.readDate = new Date().toISOString().split('T')[0];
    return { ...book };
  }


  markAsUnread(bookId) {
    const book = this.books.find(book => book.id === bookId);
    
    if (!book) {
      throw new Error(`Книга с ID ${bookId} не найдена`);
    }

    book.isRead = false;
    delete book.readDate;
    return { ...book };
  }


  updateBook(bookId, updates) {
    const book = this.books.find(book => book.id === bookId);
    
    if (!book) {
      throw new Error(`Книга с ID ${bookId} не найдена`);
    }

    const allowedUpdates = ['title', 'author', 'year'];
    const updateKeys = Object.keys(updates);
    
    const invalidFields = updateKeys.filter(key => !allowedUpdates.includes(key));
    if (invalidFields.length > 0) {
      throw new Error(`Недопустимые поля для обновления: ${invalidFields.join(', ')}`);
    }

    if (updates.title !== undefined) {
      if (!updates.title || typeof updates.title !== 'string' || updates.title.trim() === '') {
        throw new Error('Название книги должно быть непустой строкой');
      }
      book.title = updates.title.trim();
    }

    if (updates.author !== undefined) {
      if (!updates.author || typeof updates.author !== 'string' || updates.author.trim() === '') {
        throw new Error('Автор книги должен быть непустой строкой');
      }
      book.author = updates.author.trim();
    }

    if (updates.year !== undefined) {
      if (typeof updates.year !== 'number' || !Number.isInteger(updates.year) || updates.year < 0 || updates.year > new Date().getFullYear()) {
        throw new Error('Год издания должен быть положительным целым числом не больше текущего года');
      }
      book.year = updates.year;
    }

    return { ...book };
  }


  getBooks() {
    return this.books.map(book => ({ ...book })); 
  }


  getBookById(bookId) {
    const book = this.books.find(book => book.id === bookId);
    
    if (!book) {
      throw new Error(`Книга с ID ${bookId} не найдена`);
    }

    return { ...book };
  }


  getStatistics() {
    const total = this.books.length;
    const read = this.books.filter(book => book.isRead).length;
    const unread = total - read;
    const percentage = total > 0 ? Math.round((read / total) * 100) : 0;

    const authorsStats = {};
    this.books.forEach(book => {
      if (!authorsStats[book.author]) {
        authorsStats[book.author] = { count: 0, read: 0 };
      }
      authorsStats[book.author].count++;
      if (book.isRead) {
        authorsStats[book.author].read++;
      }
    });

    const popularAuthor = Object.entries(authorsStats).reduce((max, [author, stats]) => {
      return stats.count > max.count ? { author, ...stats } : max;
    }, { author: '', count: 0 });

    return {
      total,
      read,
      unread,
      percentage,
      authorsCount: Object.keys(authorsStats).length,
      popularAuthor: popularAuthor.author || 'Нет данных',
      booksPerAuthor: total > 0 ? (total / Object.keys(authorsStats).length).toFixed(1) : 0
    };
  }


  clearLibrary() {
    this.books = [];
    this.nextId = 1;
  }

  getBooksCount() {
    return this.books.length;
  }


  getBooksSortedByYear(order = 'asc') {
    const sortedBooks = [...this.books].sort((a, b) => a.year - b.year);
    return order === 'desc' ? sortedBooks.reverse() : sortedBooks;
  }


  getBooksSortedByAuthor() {
    return [...this.books].sort((a, b) => a.author.localeCompare(b.author));
  }
}