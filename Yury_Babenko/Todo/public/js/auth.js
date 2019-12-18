const $login = document.querySelector('.auth-login');
const $password = document.querySelector('.auth-password');
const $submit = document.querySelector('.auth-submit');

$submit.addEventListener('click', onAuthSubmit);

async function onAuthSubmit() {
  const payload = {
    login: $login.value,
    password: $password.value,
  };

  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    window.location = response.url;
  } catch (err) {
    alert('Ошибка при авторизации');
  }
};