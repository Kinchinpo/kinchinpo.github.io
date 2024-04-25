const btn = document.querySelector(".switch__input");
const theme = document.querySelector("#theme-link");
let darkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
    theme.href = "css/dark.css";
    localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
    theme.href = "css/light.css";
    localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
    btn.checked = true
    enableDarkMode();
}

btn.addEventListener("click", function () {
    darkMode = localStorage.getItem("dark-mode");
    if (darkMode === "disabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});