var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Act, Step, StepPoint } from './build.js';
import { ItemOrder } from './editorClasses.js';
import { ready } from './ready.js';
import { setupFetch } from './spinnerFetch.js';
let stepCategories;
let attributes;
let activeBuildId;
let currentAct;
let currentStep;
let currentPoint;
ready(() => __awaiter(void 0, void 0, void 0, function* () {
    setupFetch();
    document.addEventListener('fetchStart', () => {
        showLoading();
    });
    document.addEventListener('fetchEnd', () => {
        hideLoading();
    });
    reset();
    yield fetchStepCategories();
    yield fetchAttributes();
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
}));
// #region Event handlers
function selBuild_Change(e) {
    const selectElement = e.target;
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
function btnCancelBuild_Click(e) {
    reset();
}
function newBuild_buildName_Keypress(e) {
    const input = e.target;
    const display = document.querySelector('#newBuild_buildNameDisplay');
    display.textContent = input.value;
}
// #endregion
// #region AJAX
function goFetch(method, url, data) {
    if (method === 'POST' || method === 'PUT') {
        const f = fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then();
        return f;
    }
    else {
        const queryParams = new URLSearchParams(data).toString();
        const queryString = `${url}&${queryParams}`;
        const f = fetch(queryString);
        return f;
    }
}
function fetchStepCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield goFetch('GET', '/Editor?handler=StepCategories', {});
        const data = yield response.json();
        stepCategories = data;
    });
}
function fetchAttributes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield goFetch('GET', '/Editor?handler=Attributes', {});
        const data = yield response.json();
        attributes = data;
    });
}
function createStep(buildId, actNumber, categoryId, stepName) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber,
            category: categoryId,
            name: stepName
        };
        yield goFetch('POST', '/Editor?handler=Step', reqdata);
    });
}
function updateStep(stepId, categoryId, stepName) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            stepId: stepId,
            category: categoryId,
            name: stepName
        };
        yield goFetch('PUT', '/Editor?handler=Step', reqdata);
    });
}
function createPoint(stepId, parentId, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            stepId: stepId,
            parentId: parentId,
            text: text
        };
        yield goFetch('POST', '/Editor?handler=Point', reqdata);
    });
}
function updatePoint(pointId, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            pointId: pointId,
            text: text
        };
        yield goFetch('PUT', '/Editor?handler=Point', reqdata);
    });
}
function createLink(buildId, actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber
        };
        yield goFetch('POST', '/Editor?handler=Link', reqdata);
    });
}
function createGem(linkId, name, active, attributeId, maxLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            linkId: linkId,
            name: name,
            active: active,
            attributeId: attributeId,
            maxLevel: maxLevel
        };
        yield goFetch('POST', '/Editor?handler=Gem', reqdata);
    });
}
function updateGem(gemId, name, active, attributeId, maxLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            gemId: gemId,
            name: name,
            active: active,
            attributeId: attributeId,
            maxLevel: maxLevel
        };
        yield goFetch('PUT', '/Editor?handler=Gem', reqdata);
    });
}
function createTargetLevel(buildId, actNumber, level, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber,
            level: level,
            progress: progress
        };
        yield goFetch('POST', '/Editor?handler=TargetLevel', reqdata);
    });
}
function updateTargetLevel(targetLevelId, level, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            targetLevelId: targetLevelId,
            level: level,
            progress: progress
        };
        yield goFetch('PUT', '/Editor?handler=TargetLevel', reqdata);
    });
}
// #endregion
//#region Builds
function newBuild() {
    toggleNewBuild(true);
}
function selectBuild(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        toggleEditBuild(true);
        activeBuildId = buildId;
    });
}
function fetchAct(buildId, actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber.toString()
        };
        const response = yield goFetch('GET', '/Editor?handler=Act', reqdata);
        const data = yield response.json();
        const act = Object.assign(new Act(), data);
        return act;
    });
}
function fetchStep(stepId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            stepId: stepId.toString()
        };
        const response = yield goFetch('GET', '/Editor?handler=Step', reqdata);
        const data = yield response.json();
        const step = Object.assign(new Step(), data);
        return step;
    });
}
function fetchPoint(pointId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            pointId: pointId.toString()
        };
        const response = yield goFetch('GET', '/Editor?handler=Point', reqdata);
        const data = yield response.json();
        const point = Object.assign(new StepPoint(), data);
        return point;
    });
}
function fetchLinks(buildId, actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber
        };
        const response = yield goFetch('GET', '/Editor?handler=Links', reqdata);
        const data = yield response.json();
        return data;
    });
}
function fetchGems(linkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            linkId: linkId
        };
        const response = yield goFetch('GET', '/Editor?handler=Gems', reqdata);
        const data = yield response.json();
        return data;
    });
}
function fetchTargets(buildId, actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqdata = {
            buildId: buildId,
            actNumber: actNumber
        };
        const response = yield goFetch('GET', '/Editor?handler=TargetLevels', reqdata);
        const data = yield response.json();
        return data;
    });
}
function constructAct(actNumber_1) {
    return __awaiter(this, arguments, void 0, function* (actNumber, keepPoints = false) {
        const selectedPoint = getItemIdDataOfSelectedWrench('#editBuild_columnStep');
        toggleActDisplay(false, !keepPoints);
        const act = yield fetchAct(activeBuildId, actNumber);
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
                    e.currentTarget.firstElementChild.classList.add('text-primary');
                    currentStep = step.stepId;
                    constructStep(step.stepId);
                }
            }));
        }
        if (keepPoints) {
            const selected = document.querySelector(`#editBuild_columnStep a[data-id="${selectedPoint}"] > i.fa-wrench`);
            if (selected) {
                selected.classList.add('text-primary');
            }
        }
        const buttons = reconstructElement('#editBuild_columnStep_Buttons');
        buttons.appendChild(constructColumnButtons('Step', 'stepModal', (e) => {
            setupStepModalForCreate();
        }));
        makeListDraggable(column);
    });
}
function constructStep(stepId_1) {
    return __awaiter(this, arguments, void 0, function* (stepId, keepSubpoints = false) {
        const selectedPoint = getItemIdDataOfSelectedWrench('#editBuild_columnPoint');
        toggleStepDisplay(false, !keepSubpoints);
        const step = yield fetchStep(stepId);
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
                    e.currentTarget.firstElementChild.classList.add('text-primary');
                    currentPoint = point.stepPointId;
                    constructPoint(point.stepPointId);
                }
            }));
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
    });
}
function constructPoint(pointId) {
    return __awaiter(this, void 0, void 0, function* () {
        const point = yield fetchPoint(pointId);
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
            }));
        }
        const buttons = reconstructElement('#editBuild_columnSubpoint_Buttons');
        buttons.appendChild(constructColumnButtons('Subpoint', 'pointModal', (e) => {
            setupPointModalForCreate(point);
        }));
    });
}
function constructLinks(actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        toggleLinksContainer(true);
        const links = yield fetchLinks(activeBuildId, actNumber);
        const column = reconstructElement('#editBuild_columnLinks');
        for (const link of links) {
            const linkContainer = document.createElement('div');
            linkContainer.classList.add('d-flex', 'row', 'align-items-center', 'border-bottom', 'mb-3');
            column.appendChild(linkContainer);
            const gems = yield fetchGems(link.gemLinkId);
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
                }));
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
            });
        });
        gemButtons.appendChild(buttonCol);
    });
}
function constructTargets(actNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        toggleTargetsContainer(true);
        const targets = yield fetchTargets(activeBuildId, actNumber);
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
            }));
        }
        const buttons = reconstructElement('#editBuild_columnTargets_Buttons');
        buttons.appendChild(constructColumnButtons('Target Level', 'targetLevelModal', (e) => {
            setupTargetModalForCreate();
        }));
    });
}
function saveStepOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const stepColumn = document.querySelector('#editBuild_columnStep');
        let orders = [];
        let stepIndex = 1;
        for (const step of stepColumn.children) {
            const id = step.dataset.id;
            orders.push(new ItemOrder(parseInt(id), stepIndex++));
        }
        console.log(orders);
        yield goFetch('POST', '/Editor?handler=StepOrder', orders);
    });
}
function getItemIdDataOfSelectedWrench(columnId) {
    const selected = document.querySelector(`${columnId} a > i.text-primary`);
    if (!selected)
        return null;
    return selected.parentElement.dataset.id;
}
// #endregion
// #region Build components
function reconstructElement(elementSelector, deep = false) {
    const oldElement = document.querySelector(elementSelector);
    const element = oldElement.cloneNode(deep);
    oldElement.parentElement.replaceChild(element, oldElement);
    return element;
}
function constructCard(options) {
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
function constructFaAnchorColumn(idData, modalId, hint, faIcon, lastColumn, onClick) {
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
function clearFaSelections(columnId) {
    document.querySelectorAll(`${columnId} a > i`).forEach((ele) => ele.classList.remove('text-primary'));
}
function constructColumnButtons(columnType, modalId, onClick) {
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
function setupStepModalForUpdate(step) {
    const category = stepCategories.find(c => c.text === step.category).categoryId;
    document.querySelector('#stepModalLabel').innerText = 'Edit text';
    document.querySelector('#stepEditTextCategory').value = category;
    document.querySelector('#stepEditTextName').value = step.name;
    const oldButton = document.querySelector('#stepModalConfirm');
    const button = oldButton.cloneNode(true);
    oldButton.parentElement.replaceChild(button, oldButton);
    button.addEventListener('click', (e) => {
        const categoryId = document.querySelector('#stepEditTextCategory').value;
        const name = document.querySelector('#stepEditTextName').value;
        updateStep(step.stepId, categoryId, name)
            .then(() => {
            constructAct(currentAct, true);
        });
    });
}
function setupStepModalForCreate() {
    document.querySelector('#stepModalLabel').innerText = 'Edit text';
    const nameInput = document.querySelector('#stepEditTextName');
    nameInput.value = '';
    const button = reconstructElement('#stepModalConfirm', true);
    button.addEventListener('click', (e) => {
        const categoryId = document.querySelector('#stepEditTextCategory').value;
        const name = nameInput.value;
        createStep(activeBuildId, currentAct, categoryId, name)
            .then(() => {
            constructAct(currentAct, true);
        });
    });
}
function setupPointModalForUpdate(point, parentPoint = null) {
    document.querySelector('#pointModalLabel').innerText = 'Edit text';
    document.querySelector('#pointEditTextDesc').value = point.text;
    const oldButton = document.querySelector('#pointModalConfirm');
    const button = oldButton.cloneNode(true);
    oldButton.parentElement.replaceChild(button, oldButton);
    button.addEventListener('click', (e) => {
        const text = document.querySelector('#pointEditTextDesc').value;
        updatePoint(point.stepPointId, text)
            .then(() => {
            if (parentPoint) {
                constructPoint(parentPoint.stepPointId);
            }
            else {
                constructStep(currentStep, true);
            }
        });
    });
}
function setupPointModalForCreate(parentPoint = null) {
    document.querySelector('#pointModalLabel').innerText = 'Edit text';
    const textInput = document.querySelector('#pointEditTextDesc');
    textInput.value = '';
    const button = reconstructElement('#pointModalConfirm', true);
    button.addEventListener('click', (e) => {
        const text = textInput.value;
        createPoint(currentStep, parentPoint === null || parentPoint === void 0 ? void 0 : parentPoint.stepPointId, text)
            .then(() => {
            if (parentPoint) {
                constructPoint(parentPoint.stepPointId);
            }
            else {
                constructStep(currentStep, true);
            }
        });
    });
}
function setupGemModalForUpdate(gem) {
    console.log(gem);
    document.querySelector('#gemModalLabel').innerText = 'Edit gem';
    const nameInput = document.querySelector('#gemEditTextName');
    const activeInput = document.querySelector('#gemEditTextActive');
    const attribute = document.querySelector('#gemEditTextAttribute');
    const maxLevelInput = document.querySelector('#gemEditTextMaxLevel');
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
function setupGemModalForCreate(link) {
    document.querySelector('#gemModalLabel').innerText = 'Create gem';
    const nameInput = document.querySelector('#gemEditTextName');
    const activeInput = document.querySelector('#gemEditTextActive');
    const maxLevelInput = document.querySelector('#gemEditTextMaxLevel');
    nameInput.value = '';
    activeInput.checked = true;
    maxLevelInput.value = '';
    const button = reconstructElement('#gemModalConfirm', true);
    button.addEventListener('click', (e) => {
        const name = nameInput.value;
        const active = activeInput.checked;
        const attributeId = document.querySelector('#gemEditTextAttribute').value;
        const maxLevel = parseInt(maxLevelInput.value);
        createGem(link.gemLinkId, name, active, attributeId, maxLevel)
            .then(() => {
            constructLinks(currentAct);
        });
    });
}
function setupTargetModalForUpdate(targetLevelId) {
    document.querySelector('#targetLevelModalLabel').innerText = 'Edit target level';
    const levelInput = document.querySelector('#targetEditTextLevel');
    const progressInput = document.querySelector('#targetEditTextProgress');
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
    document.querySelector('#targetLevelModalLabel').innerText = 'Create target level';
    const levelInput = document.querySelector('#targetEditTextLevel');
    const progressInput = document.querySelector('#targetEditTextProgress');
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
function constructModal(modalId, modalBody) {
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
function constructActButtons() {
    const actsContainer = document.querySelector('#editBuild_acts');
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
            currentAct = parseInt(e.target.value);
            constructAct(currentAct);
            constructLinks(currentAct);
            constructTargets(currentAct);
        });
    }
}
// #endregion
// #region Draggable
function makeListDraggable(list) {
    let draggedItem = null;
    list.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    });
    list.addEventListener('dragend', (e) => {
        setTimeout(() => {
            e.target.style.display = '';
            draggedItem = null;
            saveStepOrder();
        }, 0);
    });
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const currentElement = document.querySelector('.dragging');
        if (afterElement === null) {
            list.appendChild(draggedItem);
        }
        else {
            list.insertBefore(draggedItem, afterElement);
        }
    });
}
function getDragAfterElement(container, y) {
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
        }
        else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY,
        element: null
    }).element;
}
// #endregion
// #region State toggling
function resetSelectBuild() {
    document.querySelector('#selBuild').value = 'default';
}
function toggleNewBuild(state) {
    if (state) {
        document.querySelector('#newBuild').classList.remove('d-none');
    }
    else {
        document.querySelector('#newBuild').classList.add('d-none');
    }
}
function toggleEditBuild(state, full = false) {
    if (state) {
        document.querySelector('#editBuild').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild').classList.add('d-none');
    }
    if (full) {
        toggleStepContainer(state);
        togglePointContainer(state);
        toggleSubpointContainer(state);
    }
}
function toggleStepContainer(state) {
    if (state) {
        document.querySelector('#editBuild_columnStep_container').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild_columnStep_container').classList.add('d-none');
    }
}
function togglePointContainer(state) {
    if (state) {
        document.querySelector('#editBuild_columnPoint_container').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild_columnPoint_container').classList.add('d-none');
    }
}
function toggleSubpointContainer(state) {
    if (state) {
        document.querySelector('#editBuild_columnSubpoint_container').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild_columnSubpoint_container').classList.add('d-none');
    }
}
function toggleLinksContainer(state) {
    if (state) {
        document.querySelector('#editBuild_columnLinks_container').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild_columnLinks_container').classList.add('d-none');
    }
}
function toggleTargetsContainer(state) {
    if (state) {
        document.querySelector('#editBuild_columnTargets_container').classList.remove('d-none');
    }
    else {
        document.querySelector('#editBuild_columnTargets_container').classList.add('d-none');
    }
}
function toggleBuildSelect(state) {
    document.querySelector('#selBuild').disabled = !state;
}
function toggleActDisplay(state, full) {
    toggleStepContainer(state);
    if (!state && full) {
        togglePointContainer(state);
        toggleSubpointContainer(state);
    }
}
function toggleStepDisplay(state, full) {
    togglePointContainer(state);
    if (!state && full) {
        toggleSubpointContainer(state);
    }
}
function reset() {
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
    constructor() {
        this.itemId = null;
        this.modalId = null;
        this.headerText = null;
        this.onClickEditText = null;
        this.onClickEditChildren = null;
    }
}
//# sourceMappingURL=Editor.js.map