using CadirosCoffers.Model;
using CadirosCoffers.Options;
using Dapper;
using Microsoft.Data.Sqlite;
using Attribute = CadirosCoffers.Model.Attribute;

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

        public IEnumerable<StepCategory> GetStepCategories()
        {
            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();

            IEnumerable<StepCategory> stepCategories = conn.Query<StepCategory>("SELECT [CategoryId], [Text] FROM GuideStepCategory");

            return stepCategories;
        }

        public IEnumerable<Attribute> GetAttributes()
        {
            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();

            IEnumerable<Attribute> attributes = conn.Query<Attribute>("SELECT [AttributeId], [Name] FROM Attribute");

            return attributes;
        }

        public BuildSimple GetBuild(string buildId)
        {
            var parameters = new { BuildId = buildId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            BuildSimple build = conn.QueryFirst<BuildSimple>(GetQueryText("GetBuild"), parameters);

            return build;
        }

        public void CreateNewBuild(string id, string name, string version)
        {
            var parameters = new { BuildId = id, Name = name, GameVersion = version };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreateNewBuild"), parameters);
        }

        public void CreateStep(string buildId, int actNumber, string category, string name, int stepIndex)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber, Category = category, Name = name, StepIndex = stepIndex };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreateStep"), parameters);
        }

        public void CreatePoint(int stepId, int? parentId, string text, int pointIndex)
        {
            var parameters = new { StepId = stepId, ParentId = parentId, Text = text, PointIndex = pointIndex };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreatePoint"), parameters);
        }

        public void CreateLink(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreateLink"), parameters);
        }

        public void CreateGem(long linkId, string name, bool active, string attributeId, long? maxLevel)
        {
            var parameters = new { LinkId = linkId, Name = name, Active = active ? 1 : 0, AttributeId = attributeId, MaxLevel = maxLevel };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreateGem"), parameters);
        }

        public void CreateTargetLevel(string buildId, int actNumber, string level, string progress)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber, Level = level, Progress = progress };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("CreateTargetLevel"), parameters);
        }

        public void UpdateStepOrder(int stepId, int index)
        {
            var parameters = new { StepId = stepId, Index = index };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("UpdateStepOrder"), parameters);
        }

        public int GetNextStepIndexForBuildAct(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            int index = conn.QuerySingle<int>(GetQueryText("GetNextStepIndexForBuildAct"), parameters);

            return index;
        }

        public int GetNextPointIndexForStep(int stepId)
        {
            var parameters = new { StepId = stepId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            int index = conn.QuerySingle<int>(GetQueryText("GetNextPointIndexForStep"), parameters);

            return index;
        }

        public int GetNextSubpointIndexForStep(int stepId, int parentId)
        {
            var parameters = new { StepId = stepId, ParentId = parentId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            int index = conn.QuerySingle<int>(GetQueryText("GetNextSubpointIndexForStep"), parameters);

            return index;
        }

        public IEnumerable<Step> GetActStepsForBuild(string buildId, int actNumber)
        {
            var parameters = new { BuildId = buildId, ActNumber = actNumber };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<Step> steps = conn.Query<Step>(GetQueryText("GetActStepsForBuild"), parameters);

            return steps;
        }

        public IEnumerable<StepPoint> GetPointsForStep(long stepId)
        {
            var parameters = new { StepId = stepId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<StepPoint> points = conn.Query<StepPoint>(GetQueryText("GetStepPointsForStep"), parameters);

            return points;
        }

        public IEnumerable<StepPoint> GetSubpointsForPoint(long pointId)
        {
            var parameters = new { PointId = pointId };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            IEnumerable<StepPoint> points = conn.Query<StepPoint>(GetQueryText("GetSubpointsForPoint"), parameters);

            return points;
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

        public void UpdateStep(int stepId, string category, string name)
        {
            var parameters = new { StepId = stepId, Category = category, Name = name };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("UpdateStep"), parameters);
        }

        public void UpdatePoint(int pointId, string text)
        {
            var parameters = new { PointId = pointId, Text = text };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("UpdatePoint"), parameters);
        }

        public void UpdateGem(long gemId, string name, bool active, string attributeId, long? maxLevel)
        {
            var parameters = new { GemId = gemId, Name = name, Active = active ? 1 : 0, AttributeId = attributeId, MaxLevel = maxLevel };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("UpdateGem"), parameters);
        }

        public void UpdateTargetLevel(long targetLevelId, string level, string progress)
        {
            var parameters = new { TargetLevelId = targetLevelId, Level = level, Progress = progress };

            using SqliteConnection conn = new(databaseOptions.ConnectionString);
            conn.Open();
            conn.Execute(GetQueryText("UpdateTargetLevel"), parameters);
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
