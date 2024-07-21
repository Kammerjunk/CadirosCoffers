export class CampaignMap {
    acts: ActMap[];
}

export class ActMap {
    number: number;
    zones: ZoneMap[];
}

export class ZoneMap {
    name: string;
    fileName: string;
    zoneIndex: number;
}