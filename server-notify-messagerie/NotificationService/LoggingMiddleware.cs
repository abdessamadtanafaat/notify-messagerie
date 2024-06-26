using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the request
        var request = await FormatRequest(context.Request);
        _logger.LogInformation($"Incoming Request: {request}");

        // Copy a pointer to the original response body stream
        var originalBodyStream = context.Response.Body;

        // Create a new memory stream to hold the response
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        // Continue down the Middleware pipeline, eventually returning to this class
        await _next(context);

        // Log the response
        var response = await FormatResponse(context.Response);
        _logger.LogInformation($"Outgoing Response: {response}");

        // Copy the contents of the new memory stream (which contains the response) to the original stream
        await responseBody.CopyToAsync(originalBodyStream);
    }

    private async Task<string> FormatRequest(HttpRequest request)
    {
        request.EnableBuffering();
        var body = request.Body;

        // Read the request stream
        var buffer = new byte[Convert.ToInt32(request.ContentLength)];
        await request.Body.ReadAsync(buffer, 0, buffer.Length);
        var bodyAsText = Encoding.UTF8.GetString(buffer);
        request.Body.Position = 0;

        return $"{request.Method} {request.Scheme}://{request.Host}{request.Path}{request.QueryString} {bodyAsText}";
    }

    private async Task<string> FormatResponse(HttpResponse response)
    {
        response.Body.Seek(0, SeekOrigin.Begin);
        var text = await new StreamReader(response.Body).ReadToEndAsync();
        response.Body.Seek(0, SeekOrigin.Begin);

        try
        {
            // Try to parse the response body as JSON
            var jsonObject = JsonConvert.DeserializeObject<object>(text);
            var formattedJson = JsonConvert.SerializeObject(jsonObject, Formatting.Indented);
            return formattedJson;
        }
        catch (JsonReaderException)
        {
            // If parsing fails, return the original response text
            return text;
        }
        //return $"{response.StatusCode}:\n {text}";
    }
}
