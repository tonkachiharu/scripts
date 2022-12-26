let user=prompt('乗っ取ったユーザーを改行で分けて入力').split('\n');
user.forEach(function(val,index){
	user[index]=val.trim();
});
document.cookie = `account=${user.join()};path=/;`;
document.cookie=`email=${prompt('何のメアドを使う？')};path=/;`;
document.cookie=`password=${prompt('パスワードは？(全員)')};path=/;`;
