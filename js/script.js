/* =====================================================
   DEFAULT USERS
===================================================== */

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


/* =====================================================
   GET USERS
===================================================== */

function getUsers() {

    const users =
        localStorage.getItem("users");

    if (users) {

        return JSON.parse(users);

    }

    localStorage.setItem(
        "users",
        JSON.stringify(defaultUsers)
    );

    return defaultUsers;
}


/* =====================================================
   SAVE USERS
===================================================== */

function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {

    const currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {
        return null;
    }

    return JSON.parse(currentUser);

}


/* =====================================================
   GET INITIALS
===================================================== */

function getInitials(name) {

    const words =
        name.trim().split(" ");

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


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const users =
                getUsers();


            const user =
                users.find(function(item) {

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


            alert(
                "Login berhasil!"
            );


            window.location.href =
                "dashboard.html";

        }
    );

}


/* =====================================================
   REGISTER
===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "registerConfirmPassword"
                    )
                    .value;


            /* CHECK PASSWORD */

            if (
                password !== confirmPassword
            ) {

                alert(
                    "Password dan konfirmasi password tidak sama!"
                );

                return;
            }


            const users =
                getUsers();


            /* CHECK USERNAME */

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


            /* CREATE USER */

            const newUser = {

                id: Date.now(),

                name: name,

                username: username,

                email: email,

                password: password

            };


            users.push(
                newUser
            );


            saveUsers(
                users
            );


            alert(
                "Registrasi berhasil! Silakan login."
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   CHECK LOGIN
===================================================== */

function checkLogin() {

    const currentUser =
        getCurrentUser();


    const currentPage =
        window.location.pathname;


    const authPage =
        currentPage.includes("login.html") ||
        currentPage.includes("register.html");


    if (
        !currentUser &&
        !authPage
    ) {

        window.location.href =
            "login.html";

    }

}


/* =====================================================
   USER DIRECTORY
===================================================== */

function UsersDirectory(
    searchText = ""
) {

    const container =
        document.getElementById(
            "usersList"
        );


    /*
       Jika halaman tidak memiliki usersList,
       fungsi langsung berhenti.
    */

    if (!container) {

        return;

    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    const users =
        getUsers();


    /*
       FILTER USER
    */

    const filteredUsers =
        users.filter(
            function(user) {


                /*
                   Jangan tampilkan akun
                   yang sedang login.
                */

                if (
                    user.id ===
                    currentUser.id
                ) {

                    return false;

                }


                const text =
                    searchText
                        .toLowerCase()
                        .trim();


                /*
                   Search berdasarkan
                   nama atau username.
                */

                return (

                    user.name
                        .toLowerCase()
                        .includes(text)

                    ||

                    user.username
                        .toLowerCase()
                        .includes(text)

                );

            }
        );


    /*
       Kosongkan container
    */

    container.innerHTML = "";


    /*
       USER TIDAK DITEMUKAN
    */

    if (
        filteredUsers.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No users found
                </h3>

                <p>
                    Try another name
                    or username.
                </p>

            </div>

        `;

        return;

    }


    /*
       TAMPILKAN USER
    */

    filteredUsers.forEach(
        function(user) {


            container.innerHTML += `

                <div class="user-card">

                    <div class="avatar">

                        ${getInitials(
                            user.name
                        )}

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


                    <button
                        class="card-btn view-btn"
                        onclick="viewUser('${user.username}')"
                    >

                        View User

                    </button>

                </div>

            `;

        }
    );

}


/* =====================================================
   SEARCH USERS
===================================================== */

function searchUsers() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    if (!searchInput) {

        return;

    }


    UsersDirectory(
        searchInput.value
    );

}


/* =====================================================
   VIEW USER
===================================================== */

function viewUser(username) {

    const users =
        getUsers();


    const user =
        users.find(
            function(item) {

                return (
                    item.username ===
                    username
                );

            }
        );


    if (!user) {

        alert(
            "User tidak ditemukan."
        );

        return;

    }


    alert(
        "Name: " +
        user.name +
        "\nUsername: @" +
        user.username
    );

}


/* =====================================================
   ACTIVE NAVBAR
===================================================== */

function setActiveNavbar() {

    const navLinks =
        document.querySelectorAll(
            ".navbar nav a"
        );


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    navLinks.forEach(
        function(link) {


            const linkPage =
                link
                    .getAttribute("href")
                    .split("/")
                    .pop();


            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

            else {

                link.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =====================================================
   START APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkLogin();

        setActiveNavbar();

        UsersDirectory();

    }
);