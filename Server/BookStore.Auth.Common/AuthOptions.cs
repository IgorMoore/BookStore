using Microsoft.IdentityModel.Tokens;
using System;
using System.Security.Cryptography;
using System.Text;

namespace BookStore.Auth.Common
{
    public class AuthOptions
    {
    public string Issure { get; set; }
    public string Audience { get; set; }

    public string  Secret { get; set; }

    public int TokenLifetime { get; set; }


    public SymmetricSecurityKey GetSymmetricSecrurityKey()
    {
      return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
    }
  }
}
