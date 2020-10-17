using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using System.Data;





namespace BookStore.Resource.API.Models
{
    public class BookStore
    {

        public BookStore()
        {

        }

        public List<Book> postOrder(Book[] Books, Guid UserId)
        {


            var listOfArrays = new List<int>();
            List<Book> response = new List<Book>();
            var c = new Dictionary<Guid, int[]>();

            try
            {
                if (Books != null)
                {
                    var bookList = GetHistoryBooks();
                    foreach (var item in Books)
                    {
                        item.User = UserId.ToString();


                        if (bookList != null)
                        {
                            if (bookList.Exists(x => x.Id == item.Id))
                            {
                                var highestNmb = bookList.Max(x => x.Id);
                                item.Id = highestNmb + 1;
                            }
                            item.Action = ActionType.NONE;
                            bookList.Add(item);
                        }

                    }

                    var convertedJson = JsonConvert.SerializeObject(bookList, Formatting.Indented);
                    var path = Path.Combine(Directory.GetCurrentDirectory() + "/DB/BooksOrderHistory.json");
                    File.WriteAllText(path, convertedJson);

                    response = convertedJson != null ? JsonConvert.DeserializeObject<IEnumerable<Book>>(convertedJson).ToList() : null;

                }
            }
            catch (Exception ex)
            {
            }

            return response;
        }



        public bool CreateList(Book[] Books, Guid UserId)
        {

            return true;

        }

        public List<Book> GetBooks()
        {
            List<Book> deserializedProduct = new List<Book>();
            var path = Path.Combine(Directory.GetCurrentDirectory() + "/DB/BookList.json");
            var myJsonString = File.ReadAllText(path);
            List<Book> list = new List<Book>();
            deserializedProduct = new List<Book>();
            deserializedProduct = JsonConvert.DeserializeObject<IEnumerable<Book>>(myJsonString).ToList();
            return deserializedProduct;
        }

        public List<Book> GetHistoryBooks()
        {
            List<Book> deserializedProduct = new List<Book>();
            var path = Path.Combine(Directory.GetCurrentDirectory() + "/DB/BooksOrderHistory.json");
            var myJsonString = File.ReadAllText(path);
            List<Book> list = new List<Book>();
            deserializedProduct = new List<Book>();
            deserializedProduct = JsonConvert.DeserializeObject<IEnumerable<Book>>(myJsonString).ToList();
            return deserializedProduct;
        }



        public List<Book> CreateNewBookList(List<Book> books)
        {

            List<Book> reply = new List<Book>();

            try
            {
                if (books != null && books.Count > 0)
                {
                    foreach (var item in books)
                    {
                        ChooseAction(item);
                    }
                    reply = GetBooks();
                }
            }
            catch (Exception)
            {



            }
            return reply;


        }


        private void ChooseAction(Book book)
        {
            switch (book.Action)
            {
                case ActionType.NONE:
                    break;
                case ActionType.ADD:
                    AddItem(book);
                    break;
                case ActionType.REMOVE:
                    RemoveItem(book);
                    break;
                case ActionType.UPDATE:
                    UpdateList(book);
                    break;

            }

        }

        private List<Book> AddItem(Book book)
        {
            List<Book> reply = new List<Book>();
            var bookList = GetBooks();
            if (bookList != null)
            {
                if (bookList.Exists(x => x.Id == book.Id))
                {
                    var highestNmb = bookList.Max(x => x.Id);
                    book.Id = highestNmb + 1;
                }

                book.Action = ActionType.NONE;
                bookList.Add(book);
                reply = WriteToJson(bookList);
            }
            return reply;
        }


        private List<Book> UpdateList(Book book)
        {
            List<Book> reply = new List<Book>();

            if (book != null)
            {
                var tmpList = GetBooks();

                if (tmpList != null && tmpList.Count > 0)
                {
                    foreach (var s in tmpList.Where(x => x.Id == book.Id))
                    {
                        s.Action = ActionType.NONE;
                        s.Author = book.Author;
                        s.Price = book.Price;
                        s.Title = book.Title;
                        s.Id = book.Id;
                    }

                    reply = WriteToJson(tmpList);
                }
            }
            return reply;
        }


        private List<Book> RemoveItem(Book book)
        {
            List<Book> reply = new List<Book>();

            if (book != null)
            {
                var tmpList = GetBooks();
                if (tmpList != null && tmpList.Count > 0)
                {
                    int count = tmpList.RemoveAll(x => x.Id == book.Id);
                    if (count > 0)
                    {
                        reply = WriteToJson(tmpList);
                    }

                }
            }
            return reply;
        }

        public List<Book> WriteToJson(List<Book> list)
        {
            List<Book> reply = new List<Book>();

            try
            {
                if (list != null && list.Count > 0)
                {
                    var convertedJson = JsonConvert.SerializeObject(list, Formatting.Indented);
                    var path = Path.Combine(Directory.GetCurrentDirectory() + "/DB/BookList.json");
                    File.WriteAllText(path, convertedJson);
                    reply = convertedJson != null ? JsonConvert.DeserializeObject<IEnumerable<Book>>(convertedJson).ToList() : null;
                }
            }
            catch (Exception)
            {
            }
            return reply;
        }
    }
}
