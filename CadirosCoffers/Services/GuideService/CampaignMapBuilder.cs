using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using System.IO.Abstractions;

namespace CadirosCoffers.Services.GuideService
{
    public class CampaignMapBuilder(DatabaseOptions databaseOptions)
    {
        public BuildsRepository Repository => new(databaseOptions);

        public CampaignMap BuildMaps()
        {
            CampaignMap campaign = new CampaignMap();

            for (int i = 1; i <= 10; i++)
            {
                ActMap? act = BuildActMap(i);
                if (act != null)
                {
                    campaign.AddAct(act);
                }
            }

            return campaign;
        }

        private ActMap? BuildActMap(int actNumber)
        {
            ActMap act = new(actNumber);

            IEnumerable<ZoneMap> zones = Repository.GetZoneMapsForAct(actNumber);

            if (!zones.Any())
            {
                return null;
            }

            act.AddZones(zones.OrderBy(z => z.ZoneIndex));

            return act;
        }
    }
}
