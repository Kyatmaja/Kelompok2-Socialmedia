
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
            "users.html";
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

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkLogin();

        getUsers();
    }
);