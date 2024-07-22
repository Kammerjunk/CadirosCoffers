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
import { ready } from './ready.js';
let activeBuild;
ready(() => __awaiter(void 0, void 0, void 0, function* () {
    document.querySelector('#selBuild').addEventListener('change', (e) => {
        selBuild_Change(e);
    });
    document.querySelector('#btnCancelBuild').addEventListener('click', (e) => {
        btnCancelBuild_Click(e);
    });
    document.querySelector('#newBuild_buildName').addEventListener('input', (e) => {
        newBuild_buildName_Keypress(e);
    });
    reset();
}));
// #region Event handlers
function selBuild_Change(e) {
    const selectElement = e.target;
    const selected = selectElement.value;
    if (selected === 'default') {
        console.log('default');
        return;
    }
    toggleBuildSelect(false);
    if (selected === '__new') {
        console.log('new');
        newBuild();
        return;
    }
    console.log('selecting');
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
function newBuild() {
    toggleNewBuild(true);
}
function selectBuild(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        toggleEditBuild(true);
        activeBuild = yield fetchBuild(buildId);
    });
}
function fetchBuild(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/?handler=Build&' + new URLSearchParams({
            buildId: buildId
        }).toString());
        const data = yield response.json();
        const build = Object.assign(new Build(), data);
        return build;
    });
}
// #region State toggling
function resetSelectBuild() {
    document.querySelector('#selBuild').value = 'default';
}
function toggleNewBuild(state) {
    if (state) {
        document.querySelector('#rowNewBuild').classList.remove('d-none');
    }
    else {
        document.querySelector('#rowNewBuild').classList.add('d-none');
    }
}
function toggleEditBuild(state) {
    if (state) {
        document.querySelector('#rowEditBuild').classList.remove('d-none');
    }
    else {
        document.querySelector('#rowEditBuild').classList.add('d-none');
    }
}
function toggleBuildSelect(state) {
    document.querySelector('#selBuild').disabled = !state;
}
function reset() {
    toggleEditBuild(false);
    toggleNewBuild(false);
    resetSelectBuild();
    toggleBuildSelect(true);
}
// #endregion
//# sourceMappingURL=Editor.js.map