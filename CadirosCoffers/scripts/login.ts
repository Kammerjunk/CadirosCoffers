import { ready } from './ready.js';

ready(() => {
    //document.querySelector('#formLoginModal').addEventListener('submit', (e) => {
    //    formLoginModal_Submit(e);
    //});

    //document.querySelector('#formLogin').addEventListener('submit', (e) => {
    //    formLogin_Submit(e);
    //});
});


async function formLoginModal_Submit(e: Event) {
    e.preventDefault();

    const username = document.querySelector('#inputUsernameModal').textContent;
    const password = document.querySelector('#inputPasswordModal').textContent;

    await fetch('/');
}

async function formLogin_Submit(e: Event) {
    e.preventDefault();

    const usernameField = document.querySelector('#inputUsername') as HTMLInputElement;
    const passwordField = document.querySelector('#inputPassword') as HTMLInputElement;
    const tokenField = document.querySelector('input[name="__RequestVerificationToken"]') as HTMLInputElement;

    const username = usernameField.value;
    const password = passwordField.value;
    const token = tokenField.value;

    const data = {
        username: username,
        password: password
    };
    console.log(data);

    const response = await fetch('/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'RequestVerificationToken': token
        },
        body: JSON.stringify(data)
    });
    //const responseData = await response.json();
    //console.log(responseData);

    //localStorage.setItem('jwt', responseData);
}