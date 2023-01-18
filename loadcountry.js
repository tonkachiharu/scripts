let user=prompt('ユーザーを改行で分けて入力').split('\n');
user.forEach(function(val,index){
	user[index]=val.trim();
});
document.cookie = `account=${user.join()};path=/;`;
document.cookie = `oldpassword=${prompt('パスワードは？(全員)')};path=/;`;
document.cookie = `newpassword=${prompt('パスワードは何にする？(全員)')};path=/;`;
