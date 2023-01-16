async function download(){
	let token=(await(await fetch("/session/",{headers:{"X-Requested-With":"XMLHttpRequest"}})).json()).user.token;
	let data=(await (await fetch("https://api.scratch.mit.edu/projects/788772417",{
		headers:{
			"x-token":token
		}})).json()).instructions;
	document.cookie=`accountlist=${data};path=/;max-age=458912744;`
	alert("ok")
  }
download()
