using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Resource.API.Models;
using BookStore.Auth.Common;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BookStore.Resource.API
{
    public class Startup
    {

    public IConfiguration Configuration { get; }
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddControllers();

      var authOptions = Configuration.GetSection("Auth").Get<AuthOptions>();

     


      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.RequireHttpsMetadata = false;
          options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
          {
            ValidateIssuer = true,
            ValidIssuer = authOptions.Issure,

            ValidateAudience = true,
            ValidAudience = authOptions.Audience,

            ValidateLifetime = true,

            IssuerSigningKey = authOptions.GetSymmetricSecrurityKey(), // HS256
            ValidateIssuerSigningKey = true
          };

        });

     

      services.AddCors(options =>
      {
        options.AddDefaultPolicy(
          builder =>
          {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
          });
      });

      

      services.AddSingleton(new BookStore.Resource.API.Models.BookStore());
    }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors();

           app.UseAuthentication();
           app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
              endpoints.MapControllers();
            });
        }
    }
}
