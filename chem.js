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
document.getElementById("id_email_address").value=getCookieValue("email");
document.getElementById("id_password").value=getCookieValue("password");
document.getElementById("email-change").getElementsByTagName("button")[0].click();
