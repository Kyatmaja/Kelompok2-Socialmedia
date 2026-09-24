//contoh teman
const defaultUsers = [
    {
        id: 1,
        name: "Andi Pratama",
        username: "andi",
        email: "andi@gmail.com",
        password: "123456789"
    },
    {
        id: 2,
        name: "Budi Santoso",
        username: "budi",
        email: "budi@gmail.com",
        password: "123456789"
    },
    {
        id: 3,
        name: "Citra Lestari",
        username: "citra",
        email: "citra@gmail.com",
        password: "123456789"
    },
    {
        id: 4,
        name: "Dina Amelia",
        username: "dina",
        email: "dina@gmail.com",
        password: "123456789"
    },
    {
        id: 5,
        name: "Eko Saputra",
        username: "eko",
        email: "eko@gmail.com",
        password: "123456789"
    },
    {
        id: 6,
        name: "Fajar Ramadhan",
        username: "fajar",
        email: "fajar@gmail.com",
        password: "123456789"
    }
];

function getUsers() {
    const users = localStorage.getItem("users");

    if (users) {
        return JSON.parse(users);
    }

    localStorage.setItem(
        "users",
        JSON.stringify(defaultUsers)
    );

    return defaultUsers;
}


function saveUsers(users) {
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}


function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}


function getFriends() {
    return JSON.parse(
        localStorage.getItem("friends") || "[]"
    );
}


function saveFriends(friends) {
    localStorage.setItem(
        "friends",
        JSON.stringify(friends)
    );
}


function getRequests() {
    return JSON.parse(
        localStorage.getItem("friendRequests") || "[]"
    );
}


function saveRequests(requests) {
    localStorage.setItem(
        "friendRequests",
        JSON.stringify(requests)
    );
}


function getNotifications() {
    return JSON.parse(
        localStorage.getItem("notifications") || "[]"
    );
}

function saveNotifications(notifications) {
    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );
}

function getInitials(name) {

    const words = name.split(" ");

    if (words.length >= 2) {
        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();
    }

    return name
        .charAt(0)
        .toUpperCase();
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername")
            .value
            .trim();

        const password =
            document.getElementById("loginPassword")
            .value;

        const users = getUsers();

        const user = users.find(function(item) {

            return (
                item.username === username &&
                item.password === password
            );

        });

        if (!user) {

            alert(
                "Username atau password salah!"
            );

            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        alert("Login berhasil!");

        window.location.href =
            "dashboard.html";
    });
}

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();

            const username =
                document.getElementById(
                    "registerUsername"
                ).value.trim();

            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "registerConfirmPassword"
                ).value;

            if (password !== confirmPassword) {

                alert(
                    "Password dan konfirmasi password tidak sama!"
                );

                return;
            }

            const users = getUsers();

            const usernameExists =
                users.some(function(user) {

                    return (
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                });


            if (usernameExists) {

                alert(
                    "Username sudah digunakan!"
                );

                return;
            }

            const newUser = {

                id: Date.now(),

                name: name,

                username: username,

                email: email,

                password: password
            };


            users.push(newUser);

            saveUsers(users);


            alert(
                "Registrasi berhasil! Silakan login."
            );

            window.location.href =
                "login.html";
        }
    );
}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";
}


function checkLogin() {

    const currentUser =
        getCurrentUser();


    const currentPage =
        window.location.pathname;


    const authPages =
        currentPage.includes(
            "login.html"
        ) ||
        currentPage.includes(
            "register.html"
        );


    if (
        !currentUser &&
        !authPages
    ) {

        window.location.href =
            "login.html";

    }

}
function UsersDirectory(
    searchText = ""
) {

    const container =
        document.getElementById("usersList");

    if (!container) {
        return;
    }

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }

    const users = getUsers();

    const friends = getFriends();

    const requests = getRequests();


    const filteredUsers =
        users.filter(function(user) {

            if (
                user.id ===
                currentUser.id
            ) {
                return false;
            }

            const text =
                searchText.toLowerCase();

            return (
                user.name
                    .toLowerCase()
                    .includes(text) ||

                user.username
                    .toLowerCase()
                    .includes(text)
            );

        });


    container.innerHTML = "";


    if (filteredUsers.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No users found.
            </div>
        `;

        return;
    }


    filteredUsers.forEach(function(user) {

        const isFriend =
            friends.includes(user.id);

        const requestSent =
            requests.some(function(request) {

                return (
                    request.from ===
                    currentUser.id &&

                    request.to ===
                    user.id
                );

            });


        let button = "";


        if (isFriend) {

            button = `
                <button
                    class="card-btn remove-btn"
                    onclick="removeFriend(${user.id})"
                >
                    Remove Friend
                </button>
            `;

        } else if (requestSent) {

            button = `
                <button
                    class="card-btn"
                    disabled
                >
                    Request Sent
                </button>
            `;

        } else {

            button = `
                <button
                    class="card-btn add-btn"
                    onclick="sendFriendRequest(${user.id})"
                >
                    + Add Friend
                </button>
            `;

        }

        container.innerHTML += `

            <div class="user-card">

                <div class="avatar">
                    ${getInitials(user.name)}
                </div>

                <h3>
                    ${user.name}
                </h3>

                <p class="username">
                    @${user.username}
                </p>

                <p class="status">
                    ● Online
                </p>

                ${button}

            </div>

        `;
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".navbar nav a");

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    navLinks.forEach(function(link) {

        const linkPage = link.getAttribute("href")
            .split("/")
            .pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });

});
document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkLogin();
        Dashboard();
        UsersDirectory();
    }
);