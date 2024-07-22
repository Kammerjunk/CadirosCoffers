import { Build } from './build.js';
import { ready } from './ready.js';

let activeBuild: Build;

ready(async () => {
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
});

// #region Event handlers
function selBuild_Change(e: Event): void {
    const selectElement = e.target as HTMLSelectElement;
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

function btnCancelBuild_Click(e: Event): void {
    reset();
}

function newBuild_buildName_Keypress(e: Event): void {
    const input = e.target as HTMLInputElement;

    const display = document.querySelector('#newBuild_buildNameDisplay');
    display.textContent = input.value;
}
// #endregion


function newBuild(): void {
    toggleNewBuild(true);
}

async function selectBuild(buildId: string): Promise<void> {
    toggleEditBuild(true);
    activeBuild = await fetchBuild(buildId);
}

async function fetchBuild(buildId: string): Promise<Build> {
    const response = await fetch('/?handler=Build&' + new URLSearchParams({
        buildId: buildId
    }).toString());
    const data = await response.json();
    const build = Object.assign(new Build(), data) as Build;

    return build;
}


// #region State toggling
function resetSelectBuild(): void {
    (document.querySelector('#selBuild') as HTMLSelectElement).value = 'default';
}

function toggleNewBuild(state: boolean): void {
    if (state) {
        document.querySelector('#rowNewBuild').classList.remove('d-none');
    } else {
        document.querySelector('#rowNewBuild').classList.add('d-none');
    }
}

function toggleEditBuild(state: boolean): void {
    if (state) {
        document.querySelector('#rowEditBuild').classList.remove('d-none');
    } else {
        document.querySelector('#rowEditBuild').classList.add('d-none');
    }
}

function toggleBuildSelect(state: boolean): void {
    (<HTMLSelectElement>document.querySelector('#selBuild')).disabled = !state;
}

function reset(): void {
    toggleEditBuild(false);
    toggleNewBuild(false);
    resetSelectBuild();
    
    toggleBuildSelect(true);
}
// #endregion
