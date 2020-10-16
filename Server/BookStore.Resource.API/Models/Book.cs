using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Resource.API.Models
{
  public class Book
  {
    public int Id { get; set; }
    public string Author { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string User { get; set; }
  public ActionType Action { get; set; }
  }

  

  public enum ActionType
  {
    ADD = 1,
    REMOVE = 2,
    UPDATE = 3,
    NONE = 4

  }
}
