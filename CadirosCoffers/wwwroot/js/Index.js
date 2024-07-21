var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Build } from './build.js';
import { CampaignMap } from './map.js';
let activeBuild;
let campaignMap;
ready(() => __awaiter(void 0, void 0, void 0, function* () {
    yield constructStaticContents();
    for (const buildSelector of document.querySelectorAll('.build-selector')) {
        buildSelector.addEventListener('click', (e) => {
            buildSelector_Click(e);
        });
    }
    document.querySelector('#btnCollapse').addEventListener('click', (e) => {
        toggleActsCollapse();
    });
}));
// #region Events
function buildSelector_Click(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof Element) {
            yield selectBuild(e.target.getAttribute('data-build'));
        }
    });
}
// #endregion
// #region Static content
function constructStaticContents() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch('/?handler=CampaignMap');
        const data = yield response.json();
        campaignMap = (_a = Object.assign(new CampaignMap(), data)) !== null && _a !== void 0 ? _a : null;
        const mainContent = document.querySelector('#guideMain');
        for (let i = 1; i <= 10; i++) {
            mainContent.appendChild(constructActHeader(i));
            const actRow = constructActRow(i);
            actRow.append(constructLevellingStepsContainer(i));
            actRow.append(constructGemLinksContainer(i));
            actRow.append(constructZoneLayoutsContainer(i));
            actRow.append(constructTargetLevelsContainer(i));
            mainContent.append(actRow);
            constructZoneLayouts(i);
        }
    });
}
function constructActHeader(actNumber) {
    const headerLink = document.createElement('a');
    headerLink.classList.add('h2', 'section-header', 'mx-n3', 'pb-2');
    headerLink.dataset.bsToggle = 'collapse';
    headerLink.setAttribute('href', `#act${actNumber}`);
    headerLink.setAttribute('role', 'button');
    headerLink.setAttribute('aria-expanded', 'false');
    headerLink.setAttribute('aria-controls', `act${actNumber}`);
    const headerSpan = document.createElement('span');
    headerSpan.classList.add('mx-3');
    headerSpan.textContent = `Act ${actNumber}`;
    headerLink.append(headerSpan);
    return headerLink;
}
function constructActRow(actNumber) {
    const row = document.createElement('div');
    row.classList.add('row', 'collapse', 'mb-5', 'act-row');
    row.id = `act${actNumber}`;
    row.setAttribute('aria-expanded', 'false');
    return row;
}
function constructLevellingStepsContainer(actNumber) {
    const col = document.createElement('div');
    col.classList.add('col-4');
    const container = document.createElement('div');
    container.classList.add('d-none');
    container.id = `act${actNumber}-levellingStepsContainer`;
    const header = document.createElement('h3');
    header.innerText = 'Levelling steps';
    container.append(header);
    const levellingSteps = document.createElement('div');
    levellingSteps.id = `act${actNumber}-levellingSteps`;
    container.append(levellingSteps);
    col.append(container);
    return col;
}
function constructGemLinksContainer(actNumber) {
    return constructStickyContainer(actNumber, 3, 'gemLinks', 'Act links');
}
function constructZoneLayoutsContainer(actNumber) {
    return constructStickyContainer(actNumber, 3, 'zoneLayouts', 'Zone layouts');
}
function constructTargetLevelsContainer(actNumber) {
    return constructStickyContainer(actNumber, 2, 'targetLevels', 'Target levels');
}
function constructStickyContainer(actNumber, colSize, columnId, headerText) {
    const col = document.createElement('div');
    col.classList.add(`col-${colSize}`);
    const stickyTop = document.createElement('div');
    stickyTop.classList.add('sticky-top', 'd-none');
    stickyTop.id = `act${actNumber}-${columnId}Container`;
    const header = document.createElement('h3');
    header.innerText = headerText;
    stickyTop.append(header);
    const inner = document.createElement('div');
    inner.id = `act${actNumber}-${columnId}`;
    stickyTop.append(inner);
    col.append(stickyTop);
    return col;
}
function constructZoneLayouts(actNumber) {
    const zoneLayouts = document.querySelector(`#act${actNumber}-zoneLayouts`);
    zoneLayouts.replaceChildren(); //empty()
    const actMap = campaignMap.acts.find(m => m.number === actNumber);
    if (!actMap) {
        return zoneLayouts;
    }
    let firstColumn = true;
    let layoutRow;
    for (let i = 0, L = actMap.zones.length; i < L; i++) {
        const zone = actMap.zones[i];
        if (firstColumn) {
            layoutRow = document.createElement('div');
            layoutRow.classList.add('row');
        }
        const zoneColumn = document.createElement('div');
        zoneColumn.classList.add('col-6');
        const zoneName = document.createElement('div');
        zoneName.classList.add('fw-bold');
        zoneName.innerText = zone.name;
        zoneColumn.append(zoneName);
        const imagePath = `./res/zones/${zone.fileName}.png`;
        const imageLink = document.createElement('a');
        imageLink.href = imagePath;
        zoneColumn.append(imageLink);
        const image = document.createElement('img');
        image.classList.add('zone-thumbnail');
        image.src = imagePath;
        imageLink.append(image);
        imageLink.addEventListener('click', (e) => {
            e.preventDefault();
            const bigImage = document.querySelector('#zoneLayoutBig');
            bigImage.setAttribute('src', imagePath);
            const bigImageContainer = document.querySelector('#zoneLayoutBigContainer');
            bigImageContainer.classList.remove('d-none');
        });
        document.querySelector(`#act${actNumber}-zoneLayoutsContainer`).classList.remove('d-none');
        layoutRow.append(zoneColumn);
        if (!firstColumn || i === L - 1) {
            zoneLayouts.append(layoutRow);
        }
        firstColumn = !firstColumn;
    }
    return zoneLayouts;
}
function toggleActsCollapse() {
    let show = true;
    const actRows = document.querySelectorAll('div.row.act-row');
    if ([...actRows].some(r => r.classList.contains('show'))) {
        show = false;
    }
    for (const row of actRows) {
        if (show) {
            row.classList.add('show');
        }
        else {
            row.classList.remove('show');
        }
    }
}
// #endregion
// #region Build content
function selectBuild(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/?handler=Build&' + new URLSearchParams({
            buildId: buildId
        }).toString());
        const data = yield response.json();
        const build = Object.assign(new Build(), data);
        activeBuild = build !== null && build !== void 0 ? build : null;
        cleanGuide();
        if (activeBuild) {
            constructGuide();
        }
    });
}
function cleanGuide() {
    for (let i = 1; i <= 10; i++) {
        document.querySelector(`#act${i}-levellingStepsContainer`).classList.add('d-none');
        document.querySelector(`#act${i}-levellingSteps`).replaceChildren();
        document.querySelector(`#act${i}-gemLinksContainer`).classList.add('d-none');
        document.querySelector(`#act${i}-gemLinks`).replaceChildren();
        document.querySelector(`#act${i}-targetLevelsContainer`).classList.add('d-none');
        document.querySelector(`#act${i}-targetLevels`).replaceChildren();
    }
}
function constructGuide() {
    for (const act of activeBuild.acts) {
        constructLevellingSteps(act.number, act.steps, activeBuild.id);
        constructGemLinks(act.number, act.gemLinks);
        constructTargetLevels(act.number, act.targetLevels);
    }
}
function constructLevellingSteps(actNumber, steps, buildId) {
    if (steps.length === 0) {
        return;
    }
    document.querySelector(`#act${actNumber}-levellingStepsContainer`).classList.remove('d-none');
    const levellingSteps = document.querySelector(`#act${actNumber}-levellingSteps`);
    for (const step of steps) {
        const stepContainer = document.createElement('div');
        stepContainer.dataset['build'] = buildId;
        const stepHeader = document.createElement('h5');
        stepHeader.innerText = `${step.category}: ${step.name}`;
        stepContainer.append(stepHeader);
        const list = document.createElement('ul');
        for (const point of step.points) {
            list.append(constructStepPoint(point));
        }
        stepContainer.append(list);
        levellingSteps.append(stepContainer);
    }
}
function constructStepPoint(point) {
    const listItem = document.createElement('li');
    const listText = document.createElement('span');
    listText.innerHTML = point.text;
    listItem.append(listText);
    if (point.subpoints.length > 0) {
        const sublist = document.createElement('ul');
        for (const subpoint of point.subpoints) {
            sublist.append(constructStepPoint(subpoint));
        }
        listItem.append(sublist);
    }
    return listItem;
}
function constructGemLinks(actNumber, links) {
    if (links.length === 0) {
        return;
    }
    document.querySelector(`#act${actNumber}-gemLinksContainer`).classList.remove('d-none');
    const container = document.querySelector(`#act${actNumber}-gemLinks`);
    for (const link of links) {
        const firstGem = link.gems[0];
        const linkHead = document.createElement('u');
        linkHead.innerText = getGemText(firstGem);
        linkHead.classList.add(getGemClass(firstGem));
        container.append(linkHead);
        const list = document.createElement('ul');
        list.classList.add('list-group', 'list-unstyled', 'pb-3');
        link.gems.slice(1).forEach(function (gem) {
            let gemText = getGemText(gem);
            let gemClass = getGemClass(gem);
            const listItem = document.createElement('li');
            listItem.classList.add(gemClass);
            listItem.innerText = gemText;
            list.append(listItem);
        });
        container.append(list);
    }
}
function constructTargetLevels(actNumber, targetLevels) {
    if (targetLevels.length === 0) {
        return;
    }
    document.querySelector(`#act${actNumber}-targetLevelsContainer`).classList.remove('d-none');
    const container = document.querySelector(`#act${actNumber}-targetLevels`);
    const table = document.createElement('table');
    table.classList.add('table', 'table-borderless');
    const thead = document.createElement('thead');
    const theadTr = document.createElement('tr');
    const thLevel = document.createElement('th');
    thLevel.classList.add('text-end');
    thLevel.innerText = 'Level';
    const thProgress = document.createElement('th');
    thProgress.innerText = 'Progress';
    theadTr.append(thLevel);
    theadTr.append(thProgress);
    thead.append(theadTr);
    table.append(thead);
    const tbody = document.createElement('tbody');
    for (const targetLevel of targetLevels) {
        const tr = document.createElement('tr');
        const tdLevel = document.createElement('td');
        tdLevel.classList.add('text-end');
        tdLevel.innerText = targetLevel.level;
        const tdProgress = document.createElement('td');
        tdProgress.innerText = targetLevel.progress;
        tr.append(tdLevel);
        tr.append(tdProgress);
        tbody.append(tr);
    }
    table.append(tbody);
    container.append(table);
}
function getGemText(gem) {
    let gemText = gem.name;
    if (gem.maxLevel > 0) {
        gemText += ` (Level ${gem.maxLevel})`;
    }
    return gemText;
}
function getGemClass(gem) {
    switch (gem.attribute) {
        case 'Strength':
            return 'strength';
        case 'Dexterity':
            return 'dexterity';
        case 'Intelligence':
            return 'intelligence';
        default:
            return '';
    }
}
// #endregion
// #region ready()
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
// #endregion
//# sourceMappingURL=Index.js.map