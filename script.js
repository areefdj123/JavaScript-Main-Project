
function hidemodalbox() {
    document.querySelector(".modalboxcontainer").style.display = "none";
}

function showmodalbox() {
    let modal = document.querySelector(".modalboxcontainer");
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
}


let usersgrid = document.querySelector('.users-grid');
let totalcount = document.querySelector('#total-users-data');
let citypills = document.querySelector('.city-pills');
let searchinput = document.querySelector("#search-input");

let allusers = [];


async function getData() {
    let i = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await i.json();
    console.log(data);
    
    return data;
}


async function main() {

    allusers = await getData();


    // DISPLAY USERS

    function display(arr) {

        usersgrid.innerHTML = "";

        arr.forEach(function(user) {

            let card = document.createElement('div');

            card.classList.add("user-card");

            card.innerHTML = `
                <div class="card-top">
                    <div class="avatar">${user.name.charAt(0)}</div>

                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.email}</p>
                        <p>${user.phone}</p>
                        <p>${user.address.city}</p>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn-view">View Details</button>
                    <button class="btn-delete">Delete</button>
                </div>
            `;


            card.querySelector('.btn-view').addEventListener('click', function() {

                let modal = document.querySelector('.modalbox');

                modal.querySelector('.modalbox-username h3').textContent = user.name;
                modal.querySelector('.modalbox-username p').textContent = user.company.name;
                modal.querySelector('.modalbox-card-top .avatar').textContent = user.name.charAt(0).toUpperCase();

                let info = document.querySelector('.modalbox-userinfo').children;

                info[0].textContent = "Email: " + user.email;
                info[1].textContent = "Phone: " + user.phone;
                info[2].textContent = "City: " + user.address.city;

                document.querySelector('#para1').textContent = "User ID: " + user.id;
                document.querySelector('#para2').textContent = "Company: " + user.company.name;

                showmodalbox();

            });


            card.querySelector('.btn-delete').addEventListener('click', async function() {
                try{
                    let response = await fetch(`https://jsonplaceholder.typicode.com/posts/1${user.id}`,{
                        method: "DELETE"
                        })
                }catch(err){
                    console.log("Error: ", err);
                    
                }

                allusers = allusers.filter(function(item) {
                    return item.id !== user.id;
                });

                display(allusers);
                updateStats();

            });


            usersgrid.appendChild(card);

        });

    }


    // UPDATE STATS

    function updateStats() {

        totalcount.textContent = allusers.length;

        let cities = {};

        allusers.forEach(function(user) {

            let city = user.address.city;

            cities[city] = (cities[city] || 0) + 1;

        });


        citypills.innerHTML = "";

        Object.keys(cities).forEach(function(city) {

            citypills.innerHTML += `
                <div class="pill">
                    <i class="fa-solid fa-location-dot"></i>
                    <p class="city-name">${city}</p>
                    <strong class="count">${cities[city]}</strong>
                </div>
            `;

        });

    }


    // SEARCH

    searchinput.addEventListener('input', function() {

        let value = searchinput.value.toLowerCase();

        let filtered = allusers.filter(function(user) {
            return user.name.toLowerCase().includes(value);
        });

        display(filtered);

    });


    // SORT A TO Z

    let sortButtons = document.querySelectorAll('.btn-sort');

    sortButtons[0].addEventListener('click', function() {

        let sorted = [...allusers];

        sorted.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

        display(sorted);

    });


    // SORT Z TO A

    sortButtons[1].addEventListener('click', function() {

        let sorted = [...allusers];

        sorted.sort(function(a, b) {
            return b.name.localeCompare(a.name);
        });

        display(sorted);

    });


    // ADD USER

   let addForm = document.querySelector('.add-user-form')
addForm.addEventListener('submit', async function(e) {

    e.preventDefault();

    let inputs = addForm.querySelectorAll('input');

    let newUser = {

        name: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,

        address: {
            city: inputs[3].value
        },

        company: {
            name: "New Company"
        }

    };

    try {

        let response = await fetch("https://jsonplaceholder.typicode.com/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newUser)

        });

        let savedUser = await response.json();

        allusers.push(savedUser);

        display(allusers);
        updateStats();

        addForm.reset();


    } catch(error) {

        console.log("Error:", error);

    }

});

display(allusers)
updateStats()

}

main();

