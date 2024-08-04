using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using NotificationService.Models;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class TokenCleanupService : BackgroundService
{
    private readonly ILogger<TokenCleanupService> _logger;
    private readonly IMongoCollection<User> _userCollection;

    public TokenCleanupService(ILogger<TokenCleanupService> logger, IMongoCollection<User> userCollection)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _userCollection = userCollection ?? throw new ArgumentNullException(nameof(userCollection));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("TokenCleanupService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("TokenCleanupService: Starting cleanup process at {Time}", DateTimeOffset.Now);
            await CleanupTokensAsync();

            // Delay for 24 hours before the next run
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }

        _logger.LogInformation("TokenCleanupService is stopping.");
    }

    private async Task CleanupTokensAsync()
    {
        var thresholdDate = DateTime.UtcNow.AddDays(-3);

        // Filter for documents with TokenCreatedAt less than thresholdDate and not null
        var filter = Builders<User>.Filter.And(
            Builders<User>.Filter.Lt(u => u.TokenCreatedAt, thresholdDate),
            Builders<User>.Filter.Exists(u => u.TokenCreatedAt),
            Builders<User>.Filter.Ne(u => u.TokenCreatedAt, null)
        );

        // Fetch documents to be updated
        var documentsToUpdate = await _userCollection.Find(filter).ToListAsync();
        
        // Log the TokenEmail and TokenCreatedAt of documents that will be updated
        _logger.LogInformation("Documents eligible for cleanup:");
        foreach (var doc in documentsToUpdate)
        {
            var tokenCreatedAt = doc.TokenCreatedAt.HasValue ? doc.TokenCreatedAt.Value.ToString("o") : "null";
            _logger.LogInformation("TokenEmail: {TokenEmail}, TokenCreatedAt: {TokenCreatedAt}", doc.TokenEmail, tokenCreatedAt);
        }

        // Perform the update
        var update = Builders<User>.Update.Set(u => u.TokenEmail, (string)null); 
        var result = await _userCollection.UpdateManyAsync(filter, update);

        _logger.LogInformation("Token cleanup executed: {Count} documents updated", result.ModifiedCount);
    }
}
