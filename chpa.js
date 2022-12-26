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
document.getElementById('id_old_password').value = getCookieValue('oldpassword');
document.getElementById('id_new_password1').value = getCookieValue('newpassword');
document.getElementById('id_new_password2').value = getCookieValue('newpassword');
document.getElementById('password-change').getElementsByTagName('button')[0].click();
