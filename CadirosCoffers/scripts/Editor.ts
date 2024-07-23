import { Build, Act, Step, StepCategory, StepPoint, GemLink, Gem, Attribute, TargetLevel } from './build.js';
import { ItemOrder } from './editorClasses.js';
import { ready } from './ready.js';
import { setupFetch } from './spinnerFetch.js';

let stepCategories: StepCategory[];
let attributes: Attribute[];

let activeBuildId: string;
let currentAct: number;
let currentStep: number;
let currentPoint: number;


ready(async () => {
    setupFetch();

    document.addEventListener('fetchStart', () => {
        showLoading();
    });

    document.addEventListener('fetchEnd', () => {
        hideLoading();
    });

    reset();
    await fetchStepCategories();
    await fetchAttributes();
    constructActButtons();
    document.querySelector('body').appendChild(constructStepModal());
    document.querySelector('body').appendChild(constructPointModal());
    document.querySelector('body').appendChild(constructGemModal());
    document.querySelector('body').appendChild(constructTargetModal()); 

    document.querySelector('#selBuild').addEventListener('change', (e) => {
        selBuild_Change(e);
    });

    document.querySelector('#btnCancelBuild').addEventListener('click', (e) => {
        btnCancelBuild_Click(e);
    });

    document.querySelector('#newBuild_buildName').addEventListener('input', (e) => {
        newBuild_buildName_Keypress(e);
    });

});

// #region Event handlers
function selBuild_Change(e: Event): void {
    const selectElement = e.target as HTMLSelectElement;
    const selected = selectElement.value;

    if (selected === 'default') {
        return;
    }

    toggleBuildSelect(false);

    if (selected === '__new') {
        newBuild();
        return;
    }

    selectBuild(selected);
}

function btnCancelBuild_Click(e: Event): void {
    reset();
}

function newBuild_buildName_Keypress(e: Event): void {
    const input = e.target as HTMLInputElement;

    const display = document.querySelector('#newBuild_buildNameDisplay');
    display.textContent = input.value;
}
// #endregion

// #region AJAX
function goFetch(method: string, url: string, data: any): Promise<Response> {
    if (method === 'POST' || method === 'PUT') {
        const f = fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then()
        return f;
    } else {
        const queryParams = new URLSearchParams(data as Record<string, string>).toString();
        const queryString = `${url}&${queryParams}`;
        const f = fetch(queryString)
        return f;
    }
}

async function fetchStepCategories() {
    const response = await goFetch('GET', '/Editor?handler=StepCategories', {});
    const data = await response.json();

    stepCategories = data;
}

async function fetchAttributes() {
    const response = await goFetch('GET', '/Editor?handler=Attributes', {});
    const data = await response.json();

    attributes = data;
}

async function createStep(buildId: string, actNumber: number, categoryId: string, stepName: string) {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber,
        category: categoryId,
        name: stepName
    };
    await goFetch('POST', '/Editor?handler=Step', reqdata);
}

async function updateStep(stepId: number, categoryId: string, stepName: string) {
    const reqdata = {
        stepId: stepId,
        category: categoryId,
        name: stepName
    };
    await goFetch('PUT', '/Editor?handler=Step', reqdata);
}

async function createPoint(stepId: number, parentId: number | null, text: string) {
    const reqdata = {
        stepId: stepId,
        parentId: parentId,
        text: text
    };
    await goFetch('POST', '/Editor?handler=Point', reqdata);
}

async function updatePoint(pointId: number, text: string) {
    const reqdata = {
        pointId: pointId,
        text: text
    };
    await goFetch('PUT', '/Editor?handler=Point', reqdata);
}

async function createLink(buildId: string, actNumber: number) {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber
    };
    await goFetch('POST', '/Editor?handler=Link', reqdata);
}

async function createGem(linkId: number, name: string, active: boolean, attributeId: string, maxLevel: number) {
    const reqdata = {
        linkId: linkId,
        name: name,
        active: active,
        attributeId: attributeId,
        maxLevel: maxLevel
    };
    await goFetch('POST', '/Editor?handler=Gem', reqdata);
}

async function updateGem(gemId: number, name: string, active: boolean, attributeId: string, maxLevel: number) {
    const reqdata = {
        gemId: gemId,
        name: name,
        active: active,
        attributeId: attributeId,
        maxLevel: maxLevel
    };
    await goFetch('PUT', '/Editor?handler=Gem', reqdata);
}

async function createTargetLevel(buildId: string, actNumber: number, level: string, progress: string) {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber,
        level: level,
        progress: progress
    };
    await goFetch('POST', '/Editor?handler=TargetLevel', reqdata);
}

async function updateTargetLevel(targetLevelId: number, level: string, progress: string) {
    const reqdata = {
        targetLevelId: targetLevelId,
        level: level,
        progress: progress
    };
    await goFetch('PUT', '/Editor?handler=TargetLevel', reqdata);
}
// #endregion

//#region Builds
function newBuild(): void {
    toggleNewBuild(true);
}

async function selectBuild(buildId: string): Promise<void> {
    toggleEditBuild(true);
    activeBuildId = buildId;
}

async function fetchAct(buildId: string, actNumber: number): Promise<Act> {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber.toString()
    };
    const response = await goFetch('GET', '/Editor?handler=Act', reqdata);
    const data = await response.json();
    const act = Object.assign(new Act(), data) as Act;

    return act;
}

async function fetchStep(stepId: number): Promise<Step> {
    const reqdata = {
        stepId: stepId.toString()
    };
    const response = await goFetch('GET', '/Editor?handler=Step', reqdata);
    const data = await response.json();
    const step = Object.assign(new Step(), data) as Step;

    return step;
}

async function fetchPoint(pointId: number): Promise<StepPoint> {
    const reqdata = {
        pointId: pointId.toString()
    };
    const response = await goFetch('GET', '/Editor?handler=Point', reqdata);
    const data = await response.json();
    const point = Object.assign(new StepPoint(), data) as StepPoint;

    return point;
}

async function fetchLinks(buildId: string, actNumber: number): Promise<GemLink[]> {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber
    };
    const response = await goFetch('GET', '/Editor?handler=Links', reqdata);
    const data = await response.json();

    return data as GemLink[];
}

async function fetchGems(linkId: number): Promise<Gem[]> {
    const reqdata = {
        linkId: linkId
    };
    const response = await goFetch('GET', '/Editor?handler=Gems', reqdata);
    const data = await response.json();

    return data as Gem[];
}

async function fetchTargets(buildId: string, actNumber: number): Promise<TargetLevel[]> {
    const reqdata = {
        buildId: buildId,
        actNumber: actNumber
    };
    const response = await goFetch('GET', '/Editor?handler=TargetLevels', reqdata);
    const data = await response.json();

    return data as TargetLevel[];
}



async function constructAct(actNumber: number, keepPoints: boolean = false): Promise<void> {
    const selectedPoint = getItemIdDataOfSelectedWrench('#editBuild_columnStep');

    toggleActDisplay(false, !keepPoints);

    const act = await fetchAct(activeBuildId, actNumber);

    toggleStepContainer(true);

    const column = reconstructElement('#editBuild_columnStep');

    for (const step of act.steps) {
        column.appendChild(constructCard({
            itemId: step.stepId.toString(),
            modalId: 'stepModal',
            headerText: `${step.category}: ${step.name}`,
            headerClasses: ['h5'],
            onClickEditText: (e) => {
                setupStepModalForUpdate(step);
            },
            onClickEditChildren: (e) => {
                e.preventDefault();

                clearFaSelections('#editBuild_columnStep');
                (e.currentTarget as HTMLElement).firstElementChild.classList.add('text-primary');

                currentStep = step.stepId;

                constructStep(step.stepId);
            }
        } as ConstructCardOptions));
    }

    if (keepPoints) {
        const selected = document.querySelector(`#editBuild_columnStep a[data-id="${selectedPoint}"] > i.fa-wrench`)
        if (selected) {
            selected.classList.add('text-primary');
        }
    }

    const buttons = reconstructElement('#editBuild_columnStep_Buttons');
    buttons.appendChild(constructColumnButtons('Step', 'stepModal', (e) => {
        setupStepModalForCreate();
    }));

    makeListDraggable(column as HTMLDivElement);
}

async function constructStep(stepId: number, keepSubpoints: boolean = false): Promise<void> {
    const selectedPoint = getItemIdDataOfSelectedWrench('#editBuild_columnPoint');

    toggleStepDisplay(false, !keepSubpoints);

    const step = await fetchStep(stepId);

    togglePointContainer(true);

    const column = reconstructElement('#editBuild_columnPoint');

    for (const point of step.points) {
        column.appendChild(constructCard({
            itemId: point.stepPointId.toString(),
            modalId: 'pointModal',
            headerText: point.text,
            onClickEditText: (e) => {
                setupPointModalForUpdate(point);
            },
            onClickEditChildren: (e) => {
                e.preventDefault();

                clearFaSelections('#editBuild_columnPoint');
                (e.currentTarget as HTMLElement).firstElementChild.classList.add('text-primary');

                currentPoint = point.stepPointId;

                constructPoint(point.stepPointId);
            }
        } as ConstructCardOptions));
    }

    if (keepSubpoints) {
        const selected = document.querySelector(`#editBuild_columnPoint a[data-id="${selectedPoint}"] > i.fa-wrench`);
        if (selected) {
            selected.classList.add('text-primary');
        }
    }

    const buttons = reconstructElement('#editBuild_columnPoint_Buttons');
    buttons.appendChild(constructColumnButtons('Point', 'pointModal', (e) => {
        setupPointModalForCreate();
    }));
}

async function constructPoint(pointId: number): Promise<void> {
    const point = await fetchPoint(pointId);

    toggleSubpointContainer(true);

    const column = reconstructElement('#editBuild_columnSubpoint');

    for (const subpoint of point.subpoints) {
        column.appendChild(constructCard({
            itemId: subpoint.stepPointId.toString(),
            modalId: 'pointModal',
            headerText: subpoint.text,
            onClickEditText: (e) => {
                setupPointModalForUpdate(subpoint, point);
            }
        } as ConstructCardOptions));
    }

    const buttons = reconstructElement('#editBuild_columnSubpoint_Buttons');
    buttons.appendChild(constructColumnButtons('Subpoint', 'pointModal', (e) => {
        setupPointModalForCreate(point);
    }));
}

async function constructLinks(actNumber: number): Promise<void> {
    toggleLinksContainer(true);

    const links = await fetchLinks(activeBuildId, actNumber);

    const column = reconstructElement('#editBuild_columnLinks');

    for (const link of links) {
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('d-flex', 'row', 'align-items-center', 'border-bottom', 'mb-3');
        column.appendChild(linkContainer);

        const gems = await fetchGems(link.gemLinkId);

        const linkHeader = document.createElement('h6');
        linkHeader.classList.add('mb-0');
        linkHeader.innerText = `Link with ${gems.length} gems`;
        linkContainer.appendChild(linkHeader);

        const ul = document.createElement('ul');
        ul.classList.add('mb-0');
        ul.dataset.id = link.gemLinkId.toString();
        linkContainer.appendChild(ul);

        for (const gem of gems) {
            const gemClass = gem.attribute.toLowerCase();

            ul.appendChild(constructCard({
                itemId: gem.gemId.toString(),
                modalId: 'gemModal',
                headerText: gem.name,
                headerClasses: [gemClass],
                onClickEditText: (e) => {
                    setupGemModalForUpdate(gem);
                }
            } as ConstructCardOptions));
        }

        //const gemButtons = reconstructElement('#editBuild_columnLinks_Buttons');
        linkContainer.appendChild(constructColumnButtons('Gem', 'gemModal', (e) => {
            setupGemModalForCreate(link);
        }));
    }


    const gemButtons = reconstructElement('#editBuild_columnLinks_Buttons');

    const buttonHeaderCol = document.createElement('div');
    buttonHeaderCol.classList.add('col');
    gemButtons.appendChild(buttonHeaderCol);

    const buttonHeader = document.createElement('h6');
    buttonHeader.classList.add('float-end', 'mb-0');
    buttonHeader.innerText = 'New link:';
    buttonHeaderCol.appendChild(buttonHeader);

    const buttonCol = document.createElement('div');
    buttonCol.classList.add('col-auto');

    const floater = document.createElement('div');
    floater.classList.add('float-end', 'me-3');
    buttonCol.appendChild(floater);

    const a = document.createElement('a');
    a.id = 'addNewLink';
    a.role = 'button';
    a.title = 'Add link';
    floater.appendChild(a);


    const i = document.createElement('i');
    i.classList.add('fa-solid', 'fa-plus');
    a.appendChild(i);


    a.addEventListener('click', (e) => {
        createLink(activeBuildId, currentAct)
            .then(() => {
                constructLinks(currentAct);
            })
    });

    gemButtons.appendChild(buttonCol);
}

async function constructTargets(actNumber: number): Promise<void> {
    toggleTargetsContainer(true);

    const targets = await fetchTargets(activeBuildId, actNumber);

    const column = reconstructElement('#editBuild_columnTargets');

    const targetsContainer = document.createElement('div');
    targetsContainer.classList.add('d-flex', 'row', 'align-items-center', 'mb-0');
    column.appendChild(targetsContainer);

    const targetsHeader = document.createElement('h6');
    targetsHeader.classList.add('mb-0');
    targetsHeader.innerText = `${targets.length} target levels in act:`;
    targetsContainer.appendChild(targetsHeader);

    const ul = document.createElement('ul');
    ul.classList.add('mb-0');
    targetsContainer.appendChild(ul);

    for (const target of targets) {
        ul.appendChild(constructCard({
            itemId: target.level,
            modalId: 'targetLevelModal',
            headerText: `${target.level}: ${target.progress}`,
            onClickEditText: (e) => {
                setupTargetModalForUpdate(target.targetLevelId);
            }
        } as ConstructCardOptions));
    }

    const buttons = reconstructElement('#editBuild_columnTargets_Buttons');
    buttons.appendChild(constructColumnButtons('Target Level', 'targetLevelModal', (e) => {
        setupTargetModalForCreate();
    }));
}

async function saveStepOrder() {
    const stepColumn = document.querySelector('#editBuild_columnStep') as HTMLDivElement;

    let orders: ItemOrder[] = [];
    let stepIndex = 1;
    for (const step of stepColumn.children) {
        const id = (step as HTMLElement).dataset.id;

        orders.push(new ItemOrder(parseInt(id), stepIndex++));
    }

    console.log(orders);

    await goFetch('POST', '/Editor?handler=StepOrder', orders);
}

function getItemIdDataOfSelectedWrench(columnId: string): string {
    const selected = document.querySelector(`${columnId} a > i.text-primary`) as HTMLElement;

    if (!selected)
        return null;

    return selected.parentElement.dataset.id;
}
// #endregion

// #region Build components
function reconstructElement(elementSelector: string, deep: boolean = false): HTMLElement {
    const oldElement = document.querySelector(elementSelector) as HTMLElement;
    const element = oldElement.cloneNode(deep);
    oldElement.parentElement.replaceChild(element, oldElement);

    return element as HTMLElement;
}

function constructCard(options: ConstructCardOptions) {
    const card = document.createElement('li');
    card.classList.add('list-unstyled', 'card', 'my-2');
    card.dataset.id = options.itemId.toString();
    card.setAttribute('draggable', 'true');

    const cardRow = document.createElement('div');
    cardRow.classList.add('d-flex', 'row', 'align-items-center');
    card.appendChild(cardRow);

    const cardHeaderCol = document.createElement('div');
    cardHeaderCol.classList.add('col', 'float-left');
    cardRow.appendChild(cardHeaderCol);

    const cardHeader = document.createElement('span');
    cardHeader.innerHTML = options.headerText;
    if (options.headerClasses) {
        cardHeader.classList.add(...(options.headerClasses));
    }
    cardHeaderCol.appendChild(cardHeader);

    cardRow.appendChild(constructFaAnchorColumn(options.itemId.toString(), options.modalId, 'Edit text', ['far', 'fa-edit'], !options.onClickEditChildren, options.onClickEditText));

    if (options.onClickEditChildren) {
        cardRow.appendChild(constructFaAnchorColumn(options.itemId.toString(), null, 'Edit children', ['fas', 'fa-wrench'], true, options.onClickEditChildren));
    }

    return card;
}

function constructFaAnchorColumn(idData: string, modalId: string, hint: string, faIcon: string[], lastColumn: boolean, onClick: (this: HTMLAnchorElement, e: MouseEvent) => void): HTMLDivElement {
    const column = document.createElement('div');
    column.classList.add('col-auto', 'float-right');

    if (lastColumn) {
        column.classList.add('me-3');
    }

    const anchor = document.createElement('a');
    anchor.role = 'button';
    anchor.dataset.id = idData;

    if (modalId) {
        anchor.dataset.bsToggle = 'modal';
        anchor.dataset.bsTarget = `#${modalId}`;
    }

    anchor.addEventListener('click', onClick);
    anchor.title = hint;
    column.appendChild(anchor);

    const icon = document.createElement('i');
    icon.classList.add(...faIcon);
    anchor.appendChild(icon);

    return column;
}

function clearFaSelections(columnId: string) {
    document.querySelectorAll(`${columnId} a > i`).forEach((ele) => ele.classList.remove('text-primary'));
}

function constructColumnButtons(columnType: string, modalId: string, onClick: (this: HTMLAnchorElement, e: MouseEvent) => void) {
    const col = document.createElement('div');
    col.classList.add('col');

    const floater = document.createElement('div');
    floater.classList.add('float-end', 'me-3');
    col.appendChild(floater);

    const a = document.createElement('a');
    a.id = `addNew${columnType}`;
    a.role = 'button';
    a.title = 'Add item';
    a.dataset.bsToggle = 'modal';
    a.dataset.bsTarget = `#${modalId}`;
    a.addEventListener('click', onClick);
    floater.appendChild(a);


    const i = document.createElement('i');
    i.classList.add('fa-solid', 'fa-plus');
    a.appendChild(i);

    return col;
}
// #endregion

// #region Modals
function setupStepModalForUpdate(step: Step) {
    const category = stepCategories.find(c => c.text === step.category).categoryId;

    (document.querySelector('#stepModalLabel') as HTMLElement).innerText = 'Edit text';
    (document.querySelector('#stepEditTextCategory') as HTMLSelectElement).value = category;
    (document.querySelector('#stepEditTextName') as HTMLInputElement).value = step.name;

    const oldButton = (document.querySelector('#stepModalConfirm') as HTMLButtonElement);
    const button = oldButton.cloneNode(true);
    oldButton.parentElement.replaceChild(button, oldButton);

    button.addEventListener('click', (e) => {
        const categoryId = (document.querySelector('#stepEditTextCategory') as HTMLSelectElement).value;
        const name = (document.querySelector('#stepEditTextName') as HTMLInputElement).value;

        updateStep(step.stepId, categoryId, name)
            .then(() => {
                constructAct(currentAct, true);
            });
    });
}

function setupStepModalForCreate() {
    (document.querySelector('#stepModalLabel') as HTMLElement).innerText = 'Edit text';
    const nameInput = (document.querySelector('#stepEditTextName') as HTMLInputElement);
    nameInput.value = '';

    const button = reconstructElement('#stepModalConfirm', true);
    button.addEventListener('click', (e) => {
        const categoryId = (document.querySelector('#stepEditTextCategory') as HTMLSelectElement).value;
        const name = nameInput.value;

        createStep(activeBuildId, currentAct, categoryId, name)
            .then(() => {
                constructAct(currentAct, true);
            });
    });
}

function setupPointModalForUpdate(point: StepPoint, parentPoint: StepPoint = null) {
    (document.querySelector('#pointModalLabel') as HTMLElement).innerText = 'Edit text';
    (document.querySelector('#pointEditTextDesc') as HTMLTextAreaElement).value = point.text;

    const oldButton = (document.querySelector('#pointModalConfirm') as HTMLButtonElement);
    const button = oldButton.cloneNode(true);
    oldButton.parentElement.replaceChild(button, oldButton);

    button.addEventListener('click', (e) => {
        const text = (document.querySelector('#pointEditTextDesc') as HTMLTextAreaElement).value;

        updatePoint(point.stepPointId, text)
            .then(() => {
                if (parentPoint) {
                    constructPoint(parentPoint.stepPointId);
                } else {
                    constructStep(currentStep, true);
                }
            });
    });
}

function setupPointModalForCreate(parentPoint: StepPoint = null) {
    (document.querySelector('#pointModalLabel') as HTMLElement).innerText = 'Edit text';
    const textInput = (document.querySelector('#pointEditTextDesc') as HTMLTextAreaElement);
    textInput.value = '';

    const button = reconstructElement('#pointModalConfirm', true);
    button.addEventListener('click', (e) => {
        const text = textInput.value;

        createPoint(currentStep, parentPoint?.stepPointId, text)
            .then(() => {
                if (parentPoint) {
                    constructPoint(parentPoint.stepPointId);
                } else {
                    constructStep(currentStep, true);
                }
            });
    });
}

function setupGemModalForUpdate(gem: Gem) {
    console.log(gem);

    (document.querySelector('#gemModalLabel') as HTMLElement).innerText = 'Edit gem';
    const nameInput = document.querySelector('#gemEditTextName') as HTMLInputElement;
    const activeInput = document.querySelector('#gemEditTextActive') as HTMLInputElement;
    const attribute = document.querySelector('#gemEditTextAttribute') as HTMLSelectElement;
    const maxLevelInput = document.querySelector('#gemEditTextMaxLevel') as HTMLInputElement;

    nameInput.value = gem.name;
    activeInput.checked = gem.active;
    attribute.value = attributes.find(a => a.name === gem.attribute).attributeId;
    maxLevelInput.value = gem.maxLevel ? gem.maxLevel.toString() : '';

    const button = reconstructElement('#gemModalConfirm', true);
    button.addEventListener('click', (e) => {
        const name = nameInput.value;
        const active = activeInput.checked;
        const attributeId = attribute.value;
        const maxLevel = parseInt(maxLevelInput.value);

        updateGem(gem.gemId, name, active, attributeId, maxLevel)
            .then(() => {
                constructLinks(currentAct);
            });
    });
}

function setupGemModalForCreate(link: GemLink) {
    (document.querySelector('#gemModalLabel') as HTMLElement).innerText = 'Create gem';
    const nameInput = document.querySelector('#gemEditTextName') as HTMLInputElement;
    const activeInput = document.querySelector('#gemEditTextActive') as HTMLInputElement;
    const maxLevelInput = document.querySelector('#gemEditTextMaxLevel') as HTMLInputElement;

    nameInput.value = '';
    activeInput.checked = true;
    maxLevelInput.value = '';

    const button = reconstructElement('#gemModalConfirm', true);
    button.addEventListener('click', (e) => {
        const name = nameInput.value;
        const active = activeInput.checked;
        const attributeId = (document.querySelector('#gemEditTextAttribute') as HTMLSelectElement).value;
        const maxLevel = parseInt(maxLevelInput.value);

        createGem(link.gemLinkId, name, active, attributeId, maxLevel)
            .then(() => {
                constructLinks(currentAct);
            });
    });
}

function setupTargetModalForUpdate(targetLevelId: number) {
    (document.querySelector('#targetLevelModalLabel') as HTMLElement).innerText = 'Edit target level';
    const levelInput = document.querySelector('#targetEditTextLevel') as HTMLInputElement;
    const progressInput = document.querySelector('#targetEditTextProgress') as HTMLInputElement;

    const button = reconstructElement('#targetLevelModalConfirm', true);
    button.addEventListener('click', (e) => {
        const level = levelInput.value;
        const progress = progressInput.value;

        updateTargetLevel(targetLevelId, level, progress)
            .then(() => {
                constructTargets(currentAct);
            });
    });
}

function setupTargetModalForCreate() {
    (document.querySelector('#targetLevelModalLabel') as HTMLElement).innerText = 'Create target level';
    const levelInput = document.querySelector('#targetEditTextLevel') as HTMLInputElement;
    const progressInput = document.querySelector('#targetEditTextProgress') as HTMLInputElement;

    levelInput.value = '';
    progressInput.value = '';

    const button = reconstructElement('#targetLevelModalConfirm', true);
    button.addEventListener('click', (e) => {
        const level = levelInput.value;
        const progress = progressInput.value;

        createTargetLevel(activeBuildId, currentAct, level, progress)
            .then(() => {
                constructTargets(currentAct);
            });
    });
}

function constructStepModal() {
    const modalBody = document.createElement('div');

    const row = document.createElement('div');
    row.classList.add('row');
    modalBody.appendChild(row);

    const colCategory = document.createElement('div');
    colCategory.classList.add('col');
    row.appendChild(colCategory);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'stepEditTextCategory';
    categorySelect.classList.add('form-select');
    colCategory.appendChild(categorySelect);
    for (const cat of stepCategories) {
        const catOption = document.createElement('option');
        catOption.value = cat.categoryId;
        catOption.innerText = cat.text;
        categorySelect.appendChild(catOption);
    }

    const colText = document.createElement('div');
    colText.classList.add('col');
    row.appendChild(colText);

    const textInput = document.createElement('input');
    textInput.id = 'stepEditTextName';
    textInput.classList.add('form-control');
    textInput.type = 'text';
    textInput.placeholder = 'Step text';
    colText.appendChild(textInput);


    return constructModal('stepModal', modalBody);
}

function constructPointModal() {
    const modalBody = document.createElement('div');

    const row = document.createElement('div');
    row.classList.add('row');
    modalBody.appendChild(row);

    const colDesc = document.createElement('div');
    colDesc.classList.add('col');
    row.appendChild(colDesc);

    const textarea = document.createElement('textarea');
    textarea.id = 'pointEditTextDesc';
    textarea.classList.add('form-control');
    textarea.placeholder = 'Point text';
    textarea.rows = 7;
    colDesc.appendChild(textarea);

    return constructModal('pointModal', modalBody);
}

function constructGemModal() {
    const modalBody = document.createElement('div');

    const nameRow = document.createElement('div');
    nameRow.classList.add('row');
    modalBody.appendChild(nameRow);

    const nameCol = document.createElement('div');
    nameCol.classList.add('col');
    nameRow.appendChild(nameCol);

    const nameInput = document.createElement('input');
    nameInput.id = 'gemEditTextName';
    nameInput.classList.add('form-control');
    nameInput.type = 'text';
    nameInput.placeholder = 'Gem name';
    nameCol.appendChild(nameInput);

    const statsRow = document.createElement('div');
    statsRow.classList.add('row');
    modalBody.appendChild(statsRow);

    const activeCol = document.createElement('div');
    activeCol.classList.add('col');
    statsRow.appendChild(activeCol);

    const activeContainer = document.createElement('div');
    activeContainer.classList.add('form-check');
    activeCol.appendChild(activeContainer);

    const activeInput = document.createElement('input');
    activeInput.id = 'gemEditTextActive';
    activeInput.classList.add('form-check-input');
    activeInput.type = 'checkbox';
    activeInput.checked = true;
    activeContainer.appendChild(activeInput);

    const activeLabel = document.createElement('label');
    activeLabel.classList.add('form-check-label');
    activeLabel.setAttribute('for', 'gemEditTextActive');
    activeLabel.innerText = 'Active';
    activeContainer.appendChild(activeLabel);

    const attributeCol = document.createElement('div');
    attributeCol.classList.add('col');
    statsRow.appendChild(attributeCol);

    const attributeSelect = document.createElement('select');
    attributeSelect.id = 'gemEditTextAttribute';
    attributeSelect.classList.add('form-select');
    attributeCol.appendChild(attributeSelect);
    for (const attr of attributes) {
        const attrOption = document.createElement('option');
        attrOption.value = attr.attributeId;
        attrOption.innerText = attr.name;
        attributeSelect.appendChild(attrOption);
    }

    const maxLevelCol = document.createElement('div');
    maxLevelCol.classList.add('col');
    statsRow.appendChild(maxLevelCol);

    const maxLevelInput = document.createElement('input');
    maxLevelInput.id = 'gemEditTextMaxLevel';
    maxLevelInput.classList.add('form-control');
    maxLevelInput.type = 'number';
    maxLevelInput.placeholder = 'Max level';
    maxLevelCol.appendChild(maxLevelInput);

    return constructModal('gemModal', modalBody);
}

function constructTargetModal() {
    const modalBody = document.createElement('div');

    const row = document.createElement('div');
    row.classList.add('row');
    modalBody.appendChild(row);

    const levelCol = document.createElement('div');
    levelCol.classList.add('col');
    row.appendChild(levelCol);

    const levelInput = document.createElement('input');
    levelInput.id = 'targetEditTextLevel';
    levelInput.classList.add('form-control');
    levelInput.type = 'text';
    levelInput.placeholder = 'Target level';
    levelCol.appendChild(levelInput);

    const progressCol = document.createElement('div');
    progressCol.classList.add('col');
    row.appendChild(progressCol);

    const progressInput = document.createElement('input');
    progressInput.id = 'targetEditTextProgress';
    progressInput.classList.add('form-control');
    progressInput.type = 'text';
    progressInput.placeholder = 'Target progress';
    progressCol.appendChild(progressInput);

    return constructModal('targetLevelModal', modalBody);
}

function constructModal(modalId: string, modalBody: HTMLElement) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.classList.add('modal', 'fade');
    modal.tabIndex = -1;
    modal.role = 'dialog';
    modal.setAttribute('aria-labelledBy', `${modalId}Label`);
    modal.ariaHidden = 'true';

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    dialog.role = 'document';
    modal.appendChild(dialog);

    const content = document.createElement('div');
    content.classList.add('modal-content');
    dialog.appendChild(content);

    const header = document.createElement('div');
    header.classList.add('modal-header');
    content.appendChild(header);

    const headerText = document.createElement('h5');
    headerText.classList.add('modal-title');
    headerText.id = `${modalId}Label`;
    header.appendChild(headerText);

    modalBody.classList.add('modal-body');
    content.appendChild(modalBody);

    const footer = document.createElement('div');
    footer.classList.add('modal-footer');
    content.appendChild(footer);

    const cancel = document.createElement('button');
    cancel.classList.add('btn', 'btn-secondary');
    cancel.type = 'button';
    cancel.dataset.bsDismiss = 'modal';
    cancel.innerText = 'Cancel';
    footer.appendChild(cancel);

    const confirm = document.createElement('button');
    confirm.classList.add('btn', 'btn-primary');
    confirm.id = `${modalId}Confirm`;
    confirm.type = 'button';
    confirm.innerText = 'Confirm';
    confirm.dataset.bsDismiss = 'modal';
    footer.appendChild(confirm);

    return modal;
}
// #endregion modals
// #endregion

// #region Static content
function constructActButtons(): void {
    const actsContainer = (document.querySelector('#editBuild_acts') as HTMLDivElement);
    for (let i = 1; i <= 10; i++) {
        const actButton = document.createElement('input');
        actButton.classList.add('btn-check');
        actButton.name = 'selectedAct';
        actButton.type = 'radio';
        actButton.id = `selectedAct${i}`;
        actButton.value = i.toString();
        actsContainer.append(actButton);

        const actLabel = document.createElement('label');
        actLabel.classList.add('btn', 'btn-outline-primary');
        actLabel.setAttribute('for', `selectedAct${i}`);
        actLabel.innerText = `Act ${i}`;
        actsContainer.append(actLabel);
    }

    for (const actButton of document.querySelectorAll('input[name="selectedAct"]')) {
        actButton.addEventListener('change', (e) => {
            currentAct = parseInt((e.target as HTMLInputElement).value)
            constructAct(currentAct);
            constructLinks(currentAct);
            constructTargets(currentAct);
        });
    }
}
// #endregion

// #region Draggable
function makeListDraggable(list: Element) {
    let draggedItem = null;

    list.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            (e.target as HTMLElement).style.display = 'none';
        }, 0);
    });

    list.addEventListener('dragend', (e) => {
        setTimeout(() => {
            (e.target as HTMLElement).style.display = '';
            draggedItem = null;
            saveStepOrder();
        }, 0);
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, (e as MouseEvent).clientY)
        const currentElement = document.querySelector('.dragging');

        if (afterElement === null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });
}

function getDragAfterElement(container: Element, y: number): Element {
    const draggableElements = [
        ...container.querySelectorAll('li:not(.dragging)')
    ];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        } else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY,
        element: null
    }).element;
}
// #endregion

// #region State toggling
function resetSelectBuild(): void {
    (document.querySelector('#selBuild') as HTMLSelectElement).value = 'default';
}

function toggleNewBuild(state: boolean): void {
    if (state) {
        document.querySelector('#newBuild').classList.remove('d-none');
    } else {
        document.querySelector('#newBuild').classList.add('d-none');
    }
}

function toggleEditBuild(state: boolean, full: boolean = false): void {
    if (state) {
        document.querySelector('#editBuild').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild').classList.add('d-none');
    }

    if (full) {
        toggleStepContainer(state);
        togglePointContainer(state);
        toggleSubpointContainer(state);
    }
}

function toggleStepContainer(state: boolean): void {
    if (state) {
        document.querySelector('#editBuild_columnStep_container').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild_columnStep_container').classList.add('d-none');
    }
}

function togglePointContainer(state: boolean): void {
    if (state) {
        document.querySelector('#editBuild_columnPoint_container').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild_columnPoint_container').classList.add('d-none');
    }
}

function toggleSubpointContainer(state: boolean): void {
    if (state) {
        document.querySelector('#editBuild_columnSubpoint_container').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild_columnSubpoint_container').classList.add('d-none');
    }
}

function toggleLinksContainer(state: boolean): void {
    if (state) {
        document.querySelector('#editBuild_columnLinks_container').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild_columnLinks_container').classList.add('d-none');
    }
}

function toggleTargetsContainer(state: boolean): void {
    if (state) {
        document.querySelector('#editBuild_columnTargets_container').classList.remove('d-none');
    } else {
        document.querySelector('#editBuild_columnTargets_container').classList.add('d-none');
    }
}

function toggleBuildSelect(state: boolean): void {
    (<HTMLSelectElement>document.querySelector('#selBuild')).disabled = !state;
}

function toggleActDisplay(state: boolean, full: boolean): void {
    toggleStepContainer(state);

    if (!state && full) {
        togglePointContainer(state);
        toggleSubpointContainer(state);
    }
}

function toggleStepDisplay(state: boolean, full: boolean): void {
    togglePointContainer(state);

    if (!state && full) {
        toggleSubpointContainer(state);
    }
}

function reset(): void {
    toggleEditBuild(false, true);
    toggleNewBuild(false);
    resetSelectBuild();
    
    toggleBuildSelect(true);
}

function showLoading() {
    const loadSpinner = document.querySelector('#loadspinner');
    const loadSpinnerContainer = loadSpinner.parentElement;

    loadSpinnerContainer.classList.add('on');
    loadSpinner.classList.add('loadspinner-ring');
}

function hideLoading() {
    const loadSpinner = document.querySelector('#loadspinner');
    const loadSpinnerContainer = loadSpinner.parentElement;

    loadSpinner.classList.remove('loadspinner-ring');
    loadSpinnerContainer.classList.remove('on');
}
// #endregion


class ConstructCardOptions {
    itemId: string = null;
    modalId: string = null;
    headerText: string = null;
    headerClasses: string[];
    onClickEditText: (this: HTMLAnchorElement, e: MouseEvent) => void = null;
    onClickEditChildren: (this: HTMLAnchorElement, e: MouseEvent) => void = null;
}