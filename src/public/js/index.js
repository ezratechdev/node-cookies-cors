const getName = async () =>{
    await fetch(`/getMyCookie` ,{
        method:'GET',
        headers : new Headers({'Content-Type':'application/json'}),
        body:null,
    })
    .then(data => data.json())
    .then(response =>{
        if(response.status == 200){
            document.getElementById('namer').innerHTML = `Your name is ${response.token}`
            document.getElementById('namer').style.color = 'green';
        }else{
            document.getElementById('namer').innerHTML = `Set a name in the form`;
            document.getElementById('namer').style.color = 'red';
        }
    })
    .catch((error) =>{
        console.error(error);
        document.getElementById('namer').innerHTML = `Something went wrong`;
        document.getElementById('namer').style.color = 'red';
    })
}



const sendCookieForm = document.getElementById('sendCookie');
sendCookieForm.addEventListener('submit' , async (event) =>{
    event.preventDefault();
    const { name } = event.target;
    const cookieData = { name : name.value };
    await fetch(`/takeMyCookie` , {
        method:'POST',
        headers: new Headers({
            'Content-Type':'application/json',
        }),
        body: cookieData ? JSON.stringify(cookieData) : null,
    })
    .then(data => data.json())
    .then(async response =>{
        if(response.status == 200){
            await getName();
            event.target.reset();
        }else{
            document.getElementById('namer').innerHTML = `Something went wrong`;
            document.getElementById('namer').style.color = 'red';
        }
    })
    .catch((error) =>{
        console.error(error);
        document.getElementById('namer').innerHTML = `Something went wrong`;
        document.getElementById('namer').style.color = 'red';
    })
});

window.onload = async () => await getName();