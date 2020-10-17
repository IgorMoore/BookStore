using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Resource.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Resource.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrdersController : ControllerBase
  {
    private readonly BookStore.Resource.API.Models.BookStore store;
    private Guid UserId => Guid.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

    public OrdersController(BookStore.Resource.API.Models.BookStore store)
    {
      this.store = store;
    }


    [HttpGet]
    [Authorize(Roles ="User")]
    [Route("")]
    public IActionResult GetOrders()
    {
            var history = store.GetHistoryBooks();
            var orderedBooks = history.Where(b => b.User == UserId.ToString());
            return Ok(orderedBooks);
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    [Route("purchase")]
    public IActionResult PostOrders([FromBody] Book[] request)
    {
      List<Book> response = new List<Book>();
      if (request != null && request.Length > 0)
      {
        BookStore.Resource.API.Models.BookStore bk = new Models.BookStore();
        response =  bk.postOrder(request, UserId);
      }
      return Ok(response);
    }



    [HttpPost]
    [Authorize(Roles = "Admin")]
    [Route("createlist")]
    public IActionResult CreateList([FromBody] Book[] request)
    {
      bool response = false;
      if (request != null && request.Length > 0)
      {
        BookStore.Resource.API.Models.BookStore bk = new Models.BookStore();
        var a = request.ToList();
         var res = bk.CreateNewBookList(a);
        if (res != null && res.Count > 0)
        {
          response = true;
        }
      }

      return Ok(response);
    }


    }
}
