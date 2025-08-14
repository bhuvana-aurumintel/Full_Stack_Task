function addItem() {
    fetch("https://dfdc42c5bffc.ngrok-free.app/add", {  
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: "Apple" }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from backend:", data);
        document.getElementById("output").textContent = JSON.stringify(data);
    })
    .catch(error => console.error("Error:", error));
}
document.getElementById("addBtn").addEventListener("click", addItem);
