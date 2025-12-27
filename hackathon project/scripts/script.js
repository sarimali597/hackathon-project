let candidates = [];
let votes = {};
const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

// Elements
const cnicInput = document.getElementById("voterCnic");
const ageInput = document.getElementById("voterAge");
const cnicMsg = document.getElementById("cnicMsg");

// Validate CNIC Format while typing
cnicInput.addEventListener("input", function() {
    if(cnicRegex.test(cnicInput.value)) {
        cnicMsg.innerText = "Format Valid ✓";
        cnicMsg.className = "cnic-hint valid-hint";
    } else {
        cnicMsg.innerText = "Invalid Format! (XXXXX-XXXXXXX-X)";
        cnicMsg.className = "cnic-hint invalid-hint";
    }
});

// Add Candidate Logic
document.getElementById("addBtn").addEventListener("click", function() {
    let name = document.getElementById("candInput").value;
    if(name.trim() !== "") {
        candidates.push(name);
        votes[name] = 0;
        let list = document.getElementById("setupList");
        let div = document.createElement("div");
        div.className = "candidate-item animate__animated animate__fadeInLeft";
        div.innerHTML = `<span><i class="fas fa-user-tag"></i> ${name}</span>`;
        list.appendChild(div);
        document.getElementById("candInput").value = "";
    }
});

// Start Election Logic
document.getElementById("startBtn").addEventListener("click", function() {
    if(candidates.length < 2) {
        alert("Please add at least 2 candidates.");
        return;
    }
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("verify-screen").style.display = "block";
    updateLeaderboard();
});

// Verify Voter Logic
document.getElementById("verifyBtn").addEventListener("click", function() {
    let ageVal = ageInput.value;
    let cnicVal = cnicInput.value;

    if(ageVal === "" || ageVal === null) {
        alert("Age field is empty! It is required to proceed.");
        ageInput.focus();
        return;
    }

    if(!cnicRegex.test(cnicVal)) {
        alert("CNIC format is incorrect or missing.");
        return;
    }

    if(ageVal < 18) {
        alert("Voter must be 18 years or older.");
        return;
    }

    document.getElementById("verify-screen").style.display = "none";
    document.getElementById("vote-screen").style.display = "block";
    renderOptions();
});

function renderOptions() {
    let box = document.getElementById("votingOptions");
    box.innerHTML = "";
    candidates.forEach(name => {
        let b = document.createElement("button");
        b.className = "candidate-item animate__animated animate__fadeInUp";
        b.style.width = "100%";
        b.innerHTML = `<span>${name}</span> <i class="fas fa-vote-yea"></i>`;
        b.onclick = () => {
            votes[name]++;
            alert("Vote recorded for " + name);
            resetForNext();
        };
        box.appendChild(b);
    });
}

function resetForNext() {
    ageInput.value = "";
    cnicInput.value = "";
    cnicMsg.innerText = "Must match Pakistani CNIC format";
    cnicMsg.className = "cnic-hint";
    document.getElementById("vote-screen").style.display = "none";
    document.getElementById("verify-screen").style.display = "block";
    updateLeaderboard();
}

function updateLeaderboard() {
    let board = document.getElementById("liveLeaderboard");
    board.innerHTML = "";
    let max = Math.max(...Object.values(votes));
    candidates.forEach(name => {
        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.padding = "5px 0";
        div.style.fontSize = "13px";
        let isLead = votes[name] === max && max > 0;
        div.innerHTML = `<span>${name} ${isLead ? '<span class="leader-badge">LEADER</span>' : ''}</span> <span>${votes[name]}</span>`;
        board.appendChild(div);
    });
}

document.getElementById("finalizeBtn").addEventListener("click", function() {
    if(confirm("End election and show final results?")) {
        document.getElementById("verify-screen").style.display = "none";
        document.getElementById("result-screen").style.display = "block";
        let fList = document.getElementById("finalList");
        fList.innerHTML = "";
        candidates.forEach(name => {
            let d = document.createElement("div");
            d.className = "candidate-item";
            d.innerHTML = `<span>${name}</span> <strong>${votes[name]} Votes</strong>`;
            fList.appendChild(d);
        });
    }
});

document.getElementById("resetBtn").addEventListener("click", function() {
    location.reload();
});