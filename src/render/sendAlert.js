export const showAlert = (text) => {
    const alert = document.createElement("div");
    alert.innerText = text;
    alert.className = "alert";
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.className = "alert slide-in";
    }, 10);

    setTimeout(() => {
        alert.className = "alert slide-out";
        setTimeout(() => {
            alert.remove();
        }, 400);
    }, 1500);
};