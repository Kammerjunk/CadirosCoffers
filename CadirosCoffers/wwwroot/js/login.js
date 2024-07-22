var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ready } from './ready.js';
ready(() => {
    //document.querySelector('#formLoginModal').addEventListener('submit', (e) => {
    //    formLoginModal_Submit(e);
    //});
    //document.querySelector('#formLogin').addEventListener('submit', (e) => {
    //    formLogin_Submit(e);
    //});
});
function formLoginModal_Submit(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const username = document.querySelector('#inputUsernameModal').textContent;
        const password = document.querySelector('#inputPasswordModal').textContent;
        yield fetch('/');
    });
}
function formLogin_Submit(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const usernameField = document.querySelector('#inputUsername');
        const passwordField = document.querySelector('#inputPassword');
        const tokenField = document.querySelector('input[name="__RequestVerificationToken"]');
        const username = usernameField.value;
        const password = passwordField.value;
        const token = tokenField.value;
        const data = {
            username: username,
            password: password
        };
        console.log(data);
        const response = yield fetch('/Login', {
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
    });
}
//# sourceMappingURL=login.js.map