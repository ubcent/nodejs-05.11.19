const $email = document.querySelector('#email');
const $password = document.querySelector('#password');
const $btnLogin = document.querySelector('#btn_login');

$btnLogin.addEventListener('click', (event) => {
    localStorage.removeItem('token');
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: $email.value,
            password: $password.value,
        }),
    })
    .then(( res ) => {
        if ( res.status !== 200 ) {
        return { token: null };
        }
        return res.json();
    })
    .then(( res ) => {
        if ( res.token ) {
            localStorage.setItem( 'user', JSON.stringify( res.user ) )
            localStorage.setItem( 'token', res.token );
            window.location = '/tasks';
        }
    });
    event.preventDefault();
});