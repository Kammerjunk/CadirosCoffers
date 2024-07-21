using CadirosCoffers.Model;
using CadirosCoffers.Options;
using Dapper;
using Microsoft.Data.Sqlite;

namespace CadirosCoffers.Data
{
    public class BuildsRepository(DatabaseOptions databaseOptions)
    {
        public IEnumerable<BuildSimple> GetAvailableBuilds()
        {
            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();

            IEnumerable<BuildSimple> builds = conn.Query<BuildSimple>("SELECT BuildId AS Id, Name FROM Build");

            return builds;
        }

        public BuildSimple GetBuild(string buildId)
        {
            var parameters = new { BuildId = buildId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            BuildSimple build = conn.QueryFirst<BuildSimple>(GetQueryText("GetBuild"), parameters);

            return build;
        }

        public IEnumerable<Step> GetActStepsForBuild(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<Step> steps = conn.Query<Step>(GetQueryText("GetActStepsForBuild"), parameters);

            return steps;
        }

        public IEnumerable<StepPoint> GetStepPointsForStep(long stepId)
        {
            var parameters = new { StepId = stepId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<StepPoint> steps = conn.Query<StepPoint>(GetQueryText("GetStepPointsForStep"), parameters);

            return steps;
        }

        public IEnumerable<GemLink> GetActGemLinksForBuild(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<GemLink> gemLinks = conn.Query<GemLink>(GetQueryText("GetActGemLinksForBuild"), parameters);

            return gemLinks;
        }

        public IEnumerable<Gem> GetGemsForLink(long gemLinkId)
        {
            var parameters = new { GemLinkId = gemLinkId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<Gem> gems = conn.Query<Gem>(GetQueryText("GetGemsForLink"), parameters);

            return gems;
        }

        public IEnumerable<TargetLevel> GetActTargetLevelsForBuild(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<TargetLevel> targetLevels = conn.Query<TargetLevel>(GetQueryText("GetActTargetLevelsForBuild"), parameters);

            return targetLevels;
        }

        public IEnumerable<ZoneMap> GetZoneMapsForAct(int actNumber)
        {
            var parameters = new { ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<ZoneMap> zones = conn.Query<ZoneMap>(GetQueryText("GetZoneMapsForAct"), parameters);

            return zones;
        }

        public string GetSaltForUser(string username)
        {
            var parameters = new { Username = username };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            string salt = conn.QuerySingle<string>($"SELECT Salt FROM User WHERE Username = '{username}'");

            return salt;
        }

        public bool GetPasswordMatch(string username, string passwordHash)
        {
            var parameters = new { Username = username, Hash = passwordHash };

            using SqliteConnection conn = new( databaseOptions.ConnectionString);
            conn.Open();
            long match = conn.QuerySingle<long>(GetQueryText("GetPasswordMatch"), parameters);

            return match == 1;
        }



        private string GetQueryText(string queryFile)
        {
            return File.ReadAllText($"./Data/Queries/{queryFile}.sql");
        }
    }
}
