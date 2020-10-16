using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Resource.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Resource.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BooksController : ControllerBase
  {

    private readonly BookStore.Resource.API.Models.BookStore store;

    public BooksController(BookStore.Resource.API.Models.BookStore store)
    {
      this.store = store;
    }


    [HttpGet]
    [Route("")]
    public IActionResult GetAvailableBooks()
    {
      return Ok(store.GetBooks());
    }
  }
}
