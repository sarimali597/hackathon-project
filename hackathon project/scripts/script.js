let candidates = [];
let votes = {};
let voterAudit = [];
let usedIds = [];

const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

document.getElementById("addBtn").onclick = () => {
    let name = document.getElementById("candInput").value;
    if (name.trim()) {
        candidates.push(name);
        votes[name] = 0;
        let div = document.createElement("div");
        div.className = "candidate-item animate__animated animate__fadeIn";
        div.innerHTML = `<span><i class="fas fa-user"></i> ${name}</span>`;
        document.getElementById("setupList").appendChild(div);
        document.getElementById("candInput").value = "";
    }
};

document.getElementById("startBtn").onclick = () => {
    if (candidates.length < 2) return alert("Please add at least 2 candidates.");

    document.getElementById("ageInputArea").style.display = document.getElementById("ageToggle").checked ? "block" : "none";
    let mode = document.getElementById("votingMode").value;
    document.getElementById("nameInputArea").style.display = (mode === 'name' || mode === 'both') ? "block" : "none";
    document.getElementById("cnicInputArea").style.display = (mode === 'cnic' || mode === 'both') ? "block" : "none";

    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("verify-screen").style.display = "block";
    document.getElementById("admin-controls").style.display = "block";
};

document.getElementById("verifyBtn").onclick = () => {
    const age = document.getElementById("voterAge").value;
    const name = document.getElementById("voterName").value;
    const cnic = document.getElementById("voterCnic").value;
    const mode = document.getElementById("votingMode").value;
    const isAgeOn = document.getElementById("ageToggle").checked;

    let voterId = "";

    if (mode === 'both') {
        if (!name || !cnicRegex.test(cnic)) return alert("Name & Valid CNIC required.");
        voterId = cnic;
    } else if (mode === 'cnic') {
        if (!cnicRegex.test(cnic)) return alert("Valid CNIC required.");
        voterId = cnic;
    } else {
        if (!name) return alert("Voter Name required.");
        voterId = name.toLowerCase().trim();
    }

    if (usedIds.includes(voterId)) return alert("Access Denied: Already Voted.");
    if (isAgeOn && (age === "" || age < 18)) return alert("Invalid Age: Must be 18+.");

    document.getElementById("verify-screen").style.display = "none";
    document.getElementById("vote-screen").style.display = "block";
    document.getElementById("admin-controls").style.display = "none";
    renderBallot(voterId);
};

function renderBallot(voterId) {
    const container = document.getElementById("votingOptions");
    container.innerHTML = "";
    candidates.forEach(name => {
        let btn = document.createElement("button");
        btn.className = "candidate-item";
        btn.innerHTML = `<span>${name}</span> <i class="fas fa-check"></i>`;
        btn.onclick = () => {
            votes[name]++;
            usedIds.push(voterId);
            voterAudit.push({ id: voterId, choice: name });
            alert("Vote Recorded for " + name);
            returnToVerify();
        };
        container.appendChild(btn);
    });
}

function returnToVerify() {
    document.getElementById("voterAge").value = "";
    document.getElementById("voterName").value = "";
    document.getElementById("voterCnic").value = "";
    document.getElementById("vote-screen").style.display = "none";
    document.getElementById("verify-screen").style.display = "block";
    document.getElementById("admin-controls").style.display = "block";
}

document.getElementById("finalizeBtn").onclick = () => {
    if (!confirm("End election and show results?")) return;

    document.getElementById("verify-screen").style.display = "none";
    document.getElementById("admin-controls").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    const list = document.getElementById("finalList");
    const tieMsg = document.getElementById("tieMessage");
    const resTitle = document.getElementById("resultTitle");
    list.innerHTML = "";

    let maxVotes = Math.max(...Object.values(votes));
    let winners = candidates.filter(name => votes[name] === maxVotes && maxVotes > 0);

    // TIE HANDLING
    if (winners.length > 1) {
        tieMsg.style.display = "block";
        resTitle.innerHTML = `<span class="head-blue">ELECTION</span> <span style="color:#ef4444;">TIED</span>`;
    } else if (winners.length === 1) {
        tieMsg.style.display = "none";
        resTitle.innerHTML = `<span class="head-blue">WINNER</span> <span class="head-teal">DECLARED</span>`;
    }

    candidates.forEach(c => {
        let isWinner = (votes[c] === maxVotes && maxVotes > 0);
        let crown = isWinner ? `<i class="fas fa-crown winner-badge-icon"></i>` : "";
        let winnerClass = isWinner ? "winner-highlight" : "";

        list.innerHTML += `
            <div class="candidate-item ${winnerClass}">
                <span>${c} ${crown}</span> 
                <strong>${votes[c]} Votes</strong>
            </div>`;
    });

    if (document.getElementById("privacyToggle").checked) {
        document.getElementById("auditLogArea").style.display = "block";
        const log = document.getElementById("auditLog");
        log.innerHTML = "";
        voterAudit.forEach(a => {
            log.innerHTML += `<div class="audit-row"><span>ID: ${a.id}</span> <span>Choice: ${a.choice}</span></div>`;
        });
    }
};

document.getElementById("resetBtn").onclick = () => location.reload();
