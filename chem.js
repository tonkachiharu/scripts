function getCookieValue(key){var arr=new Array();if(document.cookie!=''){var tmp=document.cookie.split(';');for(var i=0;i<tmp.length;i++){var data=tmp[i].split('=');arr[data[0]]=decodeURIComponent(data[1]);}}var memo=arr;var token=memo[key];return token}document.getElementById('id_email_address').value=getCookieValue('email');document.getElementById('id_password').value=getCookieValue('password');document.getElementById('email-change').getElementsByTagName('button')[0].click();
