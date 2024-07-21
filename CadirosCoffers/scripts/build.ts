export class Build {
    name: string;
    id: string;
    acts: Act[];
}

export class Act {
    number: number;
    steps: Step[];
    gemLinks: GemLink[];
    targetLevels: TargetLevel[];
}

export class Step {
    category: string;
    name: string;
    stepId: number;
    stepIndex: number;
    points: StepPoint[];
}

export class StepPoint {
    parentPointId: number;
    stepPointId: number;
    stepPointIndex: number;
    text: string;
    subpoints: StepPoint[];
}

export class GemLink {
    gemLinkId: number;
    gems: Gem[];
}

export class Gem {
    gemId: number;
    name: string;
    attribute: string;
    active: boolean;
    maxLevel: number;
}

export class TargetLevel {
    targetLevelId: number;
    level: string;
    progress: string;
}