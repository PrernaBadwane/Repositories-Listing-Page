let form = document.getElementById("searchRepo");

form.addEventListener('submit', function(e) {
    e.preventDefault();
let search = document.getElementById('search').value;
let username=search.split(' ').join('')
fetch("https://api.github.com/users/"+username)
.then((result2)=>result2.json())
.then((userData)=>{
    console.log("working")
    console.log(userData);
  
    redirectToResultPage(username,userData)

});
    

});


function redirectToResultPage(username, userData) {
    const encodedUsername = encodeURIComponent(username);
   
    window.location.href = `repo.html?username=${encodedUsername}`;
}
