using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using NotificationService.Exceptions;
using NotificationService.Models;
using NotificationService.Repositories;
using NotificationService.Security;
using NotificationService.Security.Repositories;
using NotificationService.Security.Service;
using NotificationService.Services;
using NotificationService.Validators;

namespace NotificationService
{
    using AuthService = Security.Service.AuthService;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Read the MongoDB configuration values directly
            var mongoConnectionString = Configuration["MongoSettings:ConnectionString"];
            var mongoDatabaseName = Configuration["MongoSettings:DatabaseName"];

            // Debugging: Output the connection string and database name
            System.Console.WriteLine($"Mongo Connection String: {mongoConnectionString}");
            System.Console.WriteLine($"Mongo Database Name: {mongoDatabaseName}");

            // Ensure the configuration values are not null
            if (string.IsNullOrEmpty(mongoConnectionString))
            {
                throw new ArgumentNullException(nameof(mongoConnectionString), "MongoDB connection string is not configured.");
            }
            if (string.IsNullOrEmpty(mongoDatabaseName))
            {
                throw new ArgumentNullException(nameof(mongoDatabaseName), "MongoDB database name is not configured.");
            }

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
                
            });
            
            // Register MongoDbContext with the connection string and database name
            services.AddSingleton<MongoDbContext>(serviceProvider =>
                new MongoDbContext(mongoConnectionString, mongoDatabaseName));

            // Register IMongoCollection<User> as a service
            services.AddSingleton<IMongoCollection<User>>(serviceProvider =>
            {
                var context = serviceProvider.GetRequiredService<MongoDbContext>();
                return context.Users;
            });
            
            //Register EmailService 
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.AddTransient<IEmailService, EmailService>();
            
            //Register SmsAuthService 
            services.Configure<SmsSettings>(Configuration.GetSection("SMSSettings"));
            services.AddTransient<ISmsService, SmsService>(); 
            
            services.Configure<JwtSettings>(Configuration.GetSection("JwtSettings"));
            //services.AddSingleton<JwtHandler>();
            services.AddTransient<IJwtHandler, JwtHandler>();

            
            //Register MEDIATORS
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            
            //Configure logging 
            services.AddLogging(config =>
            {
                config.AddConfiguration(Configuration.GetSection("Logging"));
                config.AddConsole();
                config.AddDebug();

            }); 
            
            // Register AutoMapper
            services.AddAutoMapper(typeof(Startup)); 
            
            
            // Add other services as needed
            services.AddTransient<IUserService, UserService>();
            //services.AddTransient<IJwtHandler, JwtHandler>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<ITokenRepository, TokenRepository>();

            // Register UserValidator as a singleton or scoped service, depending on your needs
            services.AddScoped<IUserValidators, UserValidators>();
            
            // Add global exception filter
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(GlobalExceptionFilter));
            });
            
            var jwtSettings = Configuration.GetSection("JwtSettings").Get<JwtSettings>();
            var key = Encoding.ASCII.GetBytes(jwtSettings.Secret);

            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.Events = new JwtBearerEvents
                    {
                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            // Return custom unauthorized response
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";
                            var result = System.Text.Json.JsonSerializer.Serialize(new
                            {
                                error = "You are not authorized to access this resource."
                            });
                            return context.Response.WriteAsync(result);
                        }
                    };
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            
            // Swagger Configuration
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Notify As Service", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });
            
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(); 
                // Enable middleware to serve generated Swagger as a JSON endpoint
                app.UseSwagger();

                // Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.)
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "NotifyAsService V1");
                    c.RoutePrefix = string.Empty; // serve Swagger UI at the root URL
                });
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseMiddleware<LoggingMiddleware>();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
