import { BookLibrary } from './bookLibrary.js';

describe('BookLibrary', () => {
  let library;

  beforeEach(() => {
    library = new BookLibrary();
  });

  // Тест 1: Добавление книг
  describe('Добавление книг', () => {
    test('добавляет книгу с корректными данными', () => {
      const book = library.addBook('Преступление и наказание', 'Федор Достоевский', 1866);
      
      expect(book).toEqual({
        id: expect.any(Number),
        title: 'Преступление и наказание',
        author: 'Федор Достоевский',
        year: 1866,
        isRead: false,
        addedDate: expect.any(String)
      });

      expect(library.getBooks()).toHaveLength(1);
      expect(library.getBooksCount()).toBe(1);
    });

    test('автоматически присваивает уникальные ID', () => {
      const book1 = library.addBook('Книга 1', 'Автор 1', 2000);
      const book2 = library.addBook('Книга 2', 'Автор 2', 2010);
      
      expect(book1.id).not.toBe(book2.id);
      expect(book2.id).toBe(book1.id + 1);
    });

    test('выбрасывает ошибку при пустом названии', () => {
      expect(() => library.addBook('', 'Автор', 2020))
        .toThrow('Название книги обязательно и должно быть непустой строкой');
      
      expect(() => library.addBook('   ', 'Автор', 2020))
        .toThrow('Название книги обязательно и должно быть непустой строкой');
    });

    test('выбрасывает ошибку при пустом авторе', () => {
      expect(() => library.addBook('Название', '', 2020))
        .toThrow('Автор книги обязателен и должен быть непустой строкой');
    });

    test('выбрасывает ошибку при некорректном годе', () => {
      expect(() => library.addBook('Книга', 'Автор', -2020))
        .toThrow('Год издания должен быть положительным целым числом не больше текущего года');
      
      expect(() => library.addBook('Книга', 'Автор', 3000))
        .toThrow('Год издания должен быть положительным целым числом не больше текущего года');
      
      expect(() => library.addBook('Книга', 'Автор', '2020'))
        .toThrow('Год издания должен быть положительным целым числом не больше текущего года');
    });

    test('обрезает пробелы в названии и авторе', () => {
      const book = library.addBook('  Книга с пробелами  ', '  Автор  ', 2020);
      
      expect(book.title).toBe('Книга с пробелами');
      expect(book.author).toBe('Автор');
    });
  });

  // Тест 2: Управление книгами (удаление, обновление, поиск)
  describe('Управление книгами', () => {
    let book1, book2, book3;

    beforeEach(() => {
      book1 = library.addBook('Война и мир', 'Лев Толстой', 1869);
      book2 = library.addBook('Анна Каренина', 'Лев Толстой', 1877);
      book3 = library.addBook('Преступление и наказание', 'Федор Достоевский', 1866);
    });

    test('удаляет книгу по ID', () => {
      expect(library.getBooksCount()).toBe(3);
      
      library.removeBook(book1.id);
      
      expect(library.getBooksCount()).toBe(2);
      expect(library.getBooks().some(book => book.id === book1.id)).toBe(false);
    });

    test('выбрасывает ошибку при удалении несуществующей книги', () => {
      expect(() => library.removeBook(999))
        .toThrow('Книга с ID 999 не найдена');
    });

    test('находит книги по автору', () => {
      const result = library.findBooksByAuthor('Лев Толстой');
      
      expect(result).toHaveLength(2);
      expect(result.every(book => book.author === 'Лев Толстой')).toBe(true);
    });

    test('находит книги по части имени автора', () => {
      const result = library.findBooksByAuthor('Толстой');
      
      expect(result).toHaveLength(2);
    });

    test('поиск не зависит от регистра', () => {
      const result = library.findBooksByAuthor('ЛЕВ ТОЛСТОЙ');
      
      expect(result).toHaveLength(2);
    });

    test('находит книги по названию', () => {
      const result = library.findBooksByTitle('война');
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Война и мир');
    });

    test('возвращает пустой массив если книги не найдены', () => {
      expect(library.findBooksByAuthor('Александр Пушкин')).toEqual([]);
      expect(library.findBooksByTitle('несуществующая')).toEqual([]);
    });

    test('получает книгу по ID', () => {
      const book = library.getBookById(book1.id);
      
      expect(book).toEqual(book1);
    });

    test('выбрасывает ошибку при получении несуществующей книги по ID', () => {
      expect(() => library.getBookById(999))
        .toThrow('Книга с ID 999 не найдена');
    });
  });

  // Тест 3: Статус чтения и обновление книг
  describe('Статус чтения и обновление', () => {
    let book;

    beforeEach(() => {
      book = library.addBook('Тестовая книга', 'Тестовый автор', 2020);
    });

    test('отмечает книгу как прочитанную', () => {
      const updatedBook = library.markAsRead(book.id);
      
      expect(updatedBook.isRead).toBe(true);
      expect(updatedBook.readDate).toBeDefined();
      
      const bookFromLibrary = library.getBookById(book.id);
      expect(bookFromLibrary.isRead).toBe(true);
    });

    test('выбрасывает ошибку при повторной отметке как прочитанной', () => {
      library.markAsRead(book.id);
      
      expect(() => library.markAsRead(book.id))
        .toThrow(`Книга "Тестовая книга" уже отмечена как прочитанная`);
    });

    test('отмечает книгу как непрочитанную', () => {
      library.markAsRead(book.id);
      const updatedBook = library.markAsUnread(book.id);
      
      expect(updatedBook.isRead).toBe(false);
      expect(updatedBook.readDate).toBeUndefined();
    });

    test('обновляет информацию о книге', () => {
      const updates = {
        title: 'Новое название',
        author: 'Новый автор',
        year: 2021
      };
      
      const updatedBook = library.updateBook(book.id, updates);
      
      expect(updatedBook.title).toBe('Новое название');
      expect(updatedBook.author).toBe('Новый автор');
      expect(updatedBook.year).toBe(2021);
    });

    test('выбрасывает ошибку при обновлении несуществующей книги', () => {
      expect(() => library.updateBook(999, { title: 'Новое' }))
        .toThrow('Книга с ID 999 не найдена');
    });

    test('выбрасывает ошибку при обновлении запрещенными полями', () => {
      expect(() => library.updateBook(book.id, { isRead: true }))
        .toThrow('Недопустимые поля для обновления: isRead');
    });
  });

  // Тест 4: Статистика и дополнительные функции
  describe('Статистика и дополнительные функции', () => {
    test('возвращает корректную статистику для пустой библиотеки', () => {
      const stats = library.getStatistics();
      
      expect(stats).toEqual({
        total: 0,
        read: 0,
        unread: 0,
        percentage: 0,
        authorsCount: 0,
        popularAuthor: 'Нет данных',
        booksPerAuthor: 0
      });
    });

    test('возвращает корректную статистику для заполненной библиотеки', () => {
      library.addBook('Книга 1', 'Автор 1', 2000);
      library.addBook('Книга 2', 'Автор 1', 2010);
      library.addBook('Книга 3', 'Автор 2', 2020);
      
      const books = library.getBooks();
      library.markAsRead(books[0].id);
      library.markAsRead(books[1].id);
      
      const stats = library.getStatistics();
      
      expect(stats.total).toBe(3);
      expect(stats.read).toBe(2);
      expect(stats.unread).toBe(1);
      expect(stats.percentage).toBe(67);
      expect(stats.authorsCount).toBe(2);
      expect(stats.popularAuthor).toBe('Автор 1');
      expect(stats.booksPerAuthor).toBe('1.5');
    });

    test('очищает библиотеку', () => {
      library.addBook('Книга 1', 'Автор 1', 2000);
      library.addBook('Книга 2', 'Автор 2', 2010);
      
      expect(library.getBooksCount()).toBe(2);
      
      library.clearLibrary();
      
      expect(library.getBooksCount()).toBe(0);
      expect(library.getBooks()).toEqual([]);
    });

    test('сортирует книги по году', () => {
      library.addBook('Книга новая', 'Автор', 2020);
      library.addBook('Книга старая', 'Автор', 2000);
      library.addBook('Книга средняя', 'Автор', 2010);
      
      const ascending = library.getBooksSortedByYear('asc');
      expect(ascending[0].year).toBe(2000);
      expect(ascending[2].year).toBe(2020);
      
      const descending = library.getBooksSortedByYear('desc');
      expect(descending[0].year).toBe(2020);
      expect(descending[2].year).toBe(2000);
    });

    test('сортирует книги по автору', () => {
      library.addBook('Книга C', 'Автор C', 2000);
      library.addBook('Книга A', 'Автор A', 2010);
      library.addBook('Книга B', 'Автор B', 2020);
      
      const sorted = library.getBooksSortedByAuthor();
      expect(sorted[0].author).toBe('Автор A');
      expect(sorted[1].author).toBe('Автор B');
      expect(sorted[2].author).toBe('Автор C');
    });

    test('возвращает копии книг, а не оригиналы', () => {
      const book = library.addBook('Книга', 'Автор', 2000);
      const books = library.getBooks();
      
      // Изменение возвращенной книги не должно влиять на оригинал
      books[0].title = 'Измененное название';
      
      const originalBook = library.getBookById(book.id);
      expect(originalBook.title).toBe('Книга');
    });
  });
});