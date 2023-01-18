(async () => {
    try {
        function getCookieValue(key) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                var cookiesArray = cookie.split('=');
                if (cookiesArray[0].trim() == key.trim()) {
                    return cookiesArray[1]; // (key[0],value[1])
                }
            }
            return '';
        }
        let password = getCookieValue('password');
        let username = getCookieValue('account').split(',')[0];
        let as = getCookieValue('account').split(',');
        as.splice(0, 1);
        document.cookie = `account=${as.join()};path=/`;
        let token = getCookieValue('scratchcsrftoken');
        await fetch('https://scratch.mit.edu/accounts/logout/', {
            method: 'POST',
            'headers': {
                'x-csrftoken': token
            }
        });
        token = getCookieValue('scratchcsrftoken');
        let a = await fetch('https://scratch.mit.edu/accounts/login/', {
            method: 'POST',
            body: JSON.stringify({
                'username': username,
                'password': password,
                'useMessages': false
            }),
            'headers': {
                'x-csrftoken': token,
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        location.href = 'https://scratch.mit.edu/accounts/settings/';
    } catch (e) {
        alert(e)
    }
})();
