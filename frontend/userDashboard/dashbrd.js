function appenRow(data){
   const tab=document.getElementById("payHistory");
    tab.innerHTML="";
   data.forEach((ele)=>{
    tab.append(createColumn(ele));
   })
}

function createColumn(item){
    const row=document.createElement('tr');
    const date=document.createElement('td');
    date.textContent=(item.date||'01.01.2001');
    row.appendChild(date) 
    
    const imgTd=document.createElement('td');
    const img=document.createElement('img')
    img.src=item.image;
    img.alt=item.coinname;
    img.className="icon-img";
    imgTd.append(img);
    row.appendChild(imgTd)
                                             
    const name=document.createElement('td')
    name.textContent=item.coinname.toLocaleString().toUpperCase();
    row.appendChild(name)
    
    const amount=document.createElement('td')
    amount.textContent=`$ ${(Number(item.quantity*item.price)).toLocaleString("en-US")}`;
    row.appendChild(amount);
    
    const pc=document.createElement('td');
    pc.textContent=`${item.price_change_percentage_24h} %`
    row.appendChild(pc);
    
    const marketCap=document.createElement('td');
    marketCap.textContent=`$ ${item.marketcap.toLocaleString("en-US")}`;
    row.appendChild(marketCap);

    const tt=document.createElement('td');
    tt.textContent=item.paymentType.toLocaleString().toUpperCase();
    row.appendChild(tt);

    return row;
}




// fetching all user details based on the userID stored in localStorage
let id = localStorage.getItem("id");
async function getUserDetails(id){
    try {
        let res = await fetch(`http://localhost:8080/user/${id}`)
        let data = await res.json();
        console.log(data);
        let balance = document.getElementById("user-balance");
        balance.innerText = `$${data.user.balance.toLocaleString("en-US")}`;
        
        let investements = document.getElementById("user-investments");
        investements.innerText = `$${data.user.investements.toLocaleString("en-US")}`;

        let username = document.getElementById("user-name");
        username.innerText = data.user.name;

        let email = document.getElementById("user-email")
        email.innerText = data.user.email

        let username_2 = document.getElementById("user-name-2");
        username_2.value = data.user.name

        let useremail_2 = document.getElementById("user-email-2");
        useremail_2.value = data.user.email

        let usermobile = document.getElementById("user-mobile");
        usermobile.value = data.user.mobile
    } catch (error) {
        console.log(error);
    }
}
getUserDetails(id);

// fetch request for payment history table
function fetchData(page,id) {
    fetch(`http://localhost:8080/payments/${id}?page=${page || 1}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
            const total = Number(data.total);
            pagination(Math.ceil(total / 5),id);
            console.log(data);
            appenRow(data.Data);

           
        });
}
function showModal() {
    // Assuming your modal has an ID of "myModal"
    const id=document.getElementById('myModal')
    const myModal = new bootstrap.Modal(id);
    myModal.show();
}

const pagination_btn=document.getElementById('btn-foot');
fetchData(1,id);
function pagination(total,id){
   pagination_btn.innerHTML=""; 
   for( let i=1;i<=total;i++){
    let button=document.createElement('button');
    button.textContent=i;
    button.className='page-btn';
    pagination_btn.append(button) 

    button.addEventListener('click',()=>{
       fetchData(i,id);
    })
   }
    
}
//fetch req for search bar


const btn=document.getElementById('search');
btn.addEventListener('click',()=>{
    var name=document.getElementById('search-input')
    
    fetch(`http://localhost:8080/payments/${id}?q=${name.value}`).then((res)=>res.json()).then((data)=>{
        console.log(data.Data)
        appenRow(data.Data);
         // Call and show the modal here
          
            showModal();
        pagination_btn.innerHTML="";
    })
})


// profile model use
const prof_btn = document.getElementById('prof-btn');
prof_btn.addEventListener('click', () => {
    const profile = new bootstrap.Modal(document.getElementById('profile-model'));
    profile.show();
    console.log('click');
});

//image upload js
let upload_img_form = document.getElementById("upload-img-form");
let save_img = document.getElementById("save-img");
save_img.addEventListener("click",async()=>{
    let new_image = document.getElementById("new-profile-image")
    let image = new_image.files[0];
    let data = new FormData();
    data.append('image',image)
    
    try{
        let res = await fetch("http://localhost:8080/user/profile/65aa71a20bcf82bb233d01fc",{
            method:"PATCH",
            headers:{
                "enctype":"multipart/form-data"
            },
            body:data
        })
        let new_data = await res.json();
        console.log(new_data.updated);
        let test_img = document.getElementById("test-img")
        test_img.src = new_data.updated
        let profile_pic = document.getElementById("profile-pic")
        profile_pic.src = new_data.updated
        // localStorage.removeItem("image");
        // localStorage.setItem("image",new_data.updated);
        window.location.href="./dashboard.html"
    }
    catch(error){
        console.log(error)
    }
})
upload_img_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    
})

// load image on page load
async function loadImage(id){
    try {
        let res = await fetch(`http://localhost:8080/user/profile/${id}`)
        let data = await res.json();
        console.log(data);
        let profile = data.image
        let test_img = document.getElementById("test-img")
            test_img.src = profile
            let profile_pic = document.getElementById("profile-pic")
            profile_pic.src = profile
    } catch (error) {
        console.log(error);
    }
  
}
loadImage(id);