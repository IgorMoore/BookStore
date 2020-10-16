using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Auth.Common;
using BookStoreApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace BookStoreApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IOptions<AuthOptions> authOptions;
    public AuthController(IOptions<AuthOptions> authOptions)
    {
      this.authOptions = authOptions;
    }

    private List<Account> Accounts = new List<Account>
    {
       new Account()
       {
         Id = Guid.Parse("e2371dc9-a849-4f3c-9004-df8fc921c13a"),
         Email = "user@email.com",
         Password = "user",
         Roles = new Role[]{Role.User }

       },

         new Account()
       {
         Id = Guid.Parse("7b0a1ec1-80f5-46b5-a108-fb938d3e26c0"),
         Email = "user2@email.com",
         Password = "user2",
         Roles = new Role[]{Role.User }

       },

          new Account()
       {
         Id = Guid.Parse("8e7eb047-e1e0-4801-ba41-f8360a9e64a7"),
         Email = "admin@email.com",
         Password = "admin",
         Roles = new Role[]{Role.Admin }
       }
       };

    [Route("login")]
    [HttpPost]
    public IActionResult Login([FromBody] Login request)
    {
      var user = AuthenticateUser(request.Email, request.Password);
      if (user != null)
      {
        var token = GenerateJWT(user);

        return Ok(new
        {
          access_token = token,
          user = user.Roles
        }) ;
      }

      return Unauthorized();
    }

    private Account AuthenticateUser(string email, string password)
    {
      return Accounts.SingleOrDefault(x => x.Email == email && x.Password == password);
    }


    private string GenerateJWT(Account user)
    {
      var authParams = authOptions.Value;

      var securityKey = authParams.GetSymmetricSecrurityKey();
      var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

      var claims = new List<Claim>() {
         new Claim(JwtRegisteredClaimNames.Email, user.Email),
         new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
    };

      foreach (var role in user.Roles)
      {
        claims.Add(new Claim("role", role.ToString()));
      }

      var token = new JwtSecurityToken(authParams.Issure,
        authParams.Audience,
        claims,
        expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
        signingCredentials: credentials);

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }

}

