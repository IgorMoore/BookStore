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
    public List<Book> Books => new List<Book>
    {
       new Book{Id = 1,Author = "J.K. Rowling",Title = "Harry Potter",Price = 10.45M },
       new Book{Id = 2,Author = "Herman Melville",Title = "Moby-Dick",Price = 8.52M },
       new Book{Id = 3,Author = "Jules Verne",Title = "The Mysterious Island",Price = 7.11M },
       new Book{Id = 4,Author = "Carlo Callodi",Title = "The Adventure of Pinnochio",Price = 6.42M },
    };

    public  Dictionary<Guid, int[]> Orders => new Dictionary<Guid, int[]>
    {
      //{ Guid.Parse("e2371dc9-a849-4f3c-9004-df8fc921c13a"), new int[] { 1,3} },
      //{ Guid.Parse("7b0a1ec1-80f5-46b5-a108-fb938d3e26c0"), new int[] { 2,3,4} },
    };


    public List<Book> postOrder(Book[] Books, Guid UserId)
    {

      //bool reply = false;
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
            //listOfArrays.Add(item.Id);
            //if (c.ContainsKey(UserId))
            //{
            //  c.Remove(UserId);
            //};
          }
          //var res =  listOfArrays.ToArray();
          //c.Add(UserId, res);
          //reply = true;
          var convertedJson = JsonConvert.SerializeObject(bookList, Formatting.Indented);
          File.WriteAllText("C:/Digital/CodeOasis/Server/BookStore.Resource.API/DB/BooksOrderHistory.json", convertedJson);
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


    ////////////////////////////////////////////////////////////////////////////


    public List<Book> GetBooks()
    {
      List<Book> deserializedProduct = new List<Book>();
      var myJsonString = File.ReadAllText("C:/Digital/CodeOasis/Server/BookStore.Resource.API/DB/BookList.json");
      List<Book> list = new List<Book>();
      deserializedProduct = new List<Book>();
      deserializedProduct = JsonConvert.DeserializeObject<IEnumerable<Book>>(myJsonString).ToList();
      return deserializedProduct;
    }

    public List<Book> GetHistoryBooks()
    {
      List<Book> deserializedProduct = new List<Book>();
      var myJsonString = File.ReadAllText("C:/Digital/CodeOasis/Server/BookStore.Resource.API/DB/BooksOrderHistory.json");
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
          File.WriteAllText("C:/Digital/CodeOasis/Server/BookStore.Resource.API/DB/BookList.json", convertedJson);
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
