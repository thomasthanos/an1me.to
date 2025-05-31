// --- Είναι το script μέσα σε iframe; ---
const isInIframe = window.self !== window.top;

let currentSpeed = null;

// Πάντα παίρνουμε το speed όταν φορτώνει το script
function updateSpeedFromStorage() {
    chrome.storage.local.get(['selectedSpeed'], function(result) {
        if (result.selectedSpeed) {
            currentSpeed = Number(result.selectedSpeed);
        } else {
            currentSpeed = 4; // default value
        }
    });
}
updateSpeedFromStorage();

// Ακούμε για αλλαγές στο storage για να πιάνει και "ζωντανές" αλλαγές από popup
chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === "local" && changes.selectedSpeed) {
        currentSpeed = Number(changes.selectedSpeed.newValue);
    }
});

// Βοηθητικό: Container για overlay (και για fullscreen)
function getOverlayContainer() {
    let wrapper = document.querySelector('.plyr__video-wrapper');
    if (wrapper) return wrapper;
    let video = document.querySelector('video');
    if (video && video.parentElement) return video.parentElement;
    return document.body;
}

// --- Μήνυμα μόνο στο iframe με το video ---
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.showSpeedNotification) {
        if (isInIframe && document.querySelector('.plyr__video-wrapper, video')) {
            // Βάλε εδώ το μήνυμα ΟΠΩΣ το θες. Αφαίρεσα τα <br>!
            showHintMessage("⚠️ Για να δουλέψει, κάνε κλικ πάνω στο βίντεο και μετά πάτησε F7!");
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === "F7") {
        setSpeed(currentSpeed ?? 4);
    }
});
document.addEventListener('keyup', function(e) {
    if (e.key === "F7") {
        setSpeed(1);
    }
});

function setSpeed(speed) {
    let videos = document.querySelectorAll('video');
    videos.forEach(video => video.playbackRate = speed);

    // Speed badge μόνο στο iframe που έχει video
    if (isInIframe && videos.length > 0) {
        showSpeedBadge("" + speed + "x");
    }
}

// ------- MINIMAL 3D SPEED BADGE (πάνω αριστερά, Comic Sans) ------- //
function showSpeedBadge(msg) {
    let container = getOverlayContainer();
    let badge = container.querySelector("#speed-badge-msg");
    if (!badge) {
        badge = document.createElement("div");
        badge.id = "speed-badge-msg";
        container.appendChild(badge);
    }
    badge.textContent = msg;
    badge.style.position = "absolute";
    badge.style.top = "18px";
    badge.style.left = "18px";
    badge.style.padding = "3px 13px";
    badge.style.background = "linear-gradient(110deg, #23242b 70%, #2d2f36 100%)";
    badge.style.color = "#eef0f3";
    badge.style.fontSize = "1.08em";
    badge.style.fontWeight = "bold";
    badge.style.fontFamily = '"Comic Sans MS", "Comic Sans", cursive';
    badge.style.borderRadius = "11px";
    badge.style.boxShadow = "0 2px 8px 0 #1117222a, 0 1.5px 4px #16181b3b";
    badge.style.zIndex = 2147483647;
    badge.style.letterSpacing = "0.8px";
    badge.style.userSelect = "none";
    badge.style.transition = "opacity 0.33s, transform 0.26s";
    badge.style.opacity = 1;
    badge.style.pointerEvents = "none";
    badge.style.backdropFilter = "blur(1.5px) saturate(1.07)";
    badge.style.textShadow = "0 0.5px 2px #0007";
    badge.style.border = "1.5px solid #7e89a855";
    badge.style.outline = "1.2px solid #e8eaff42";
    badge.style.outlineOffset = "-2.5px";
    badge.style.transform = "translateY(0px) scale(1)";
    badge.style.maxWidth = "160px";
    badge.style.width = "max-content";
    if (container !== document.body && container.style.position !== "relative") {
        container.style.position = "relative";
    }
    clearTimeout(badge._timeout);
    badge._timeout = setTimeout(() => {
        badge.style.opacity = 0;
        badge.style.transform = "translateY(-9px) scale(0.98)";
        setTimeout(()=>{ if(badge) badge.remove(); }, 400);
    }, 1500);
}

// ------- MINIMAL 3D HINT MESSAGE (πάνω κέντρο, Comic Sans, μεγάλο width & font) ------- //
function showHintMessage(msg) {
    let container = getOverlayContainer();
    let oldDiv = container.querySelector("#speed-hint-msg");
    if (oldDiv) oldDiv.remove();

    let div = document.createElement("div");
    div.id = "speed-hint-msg";
    div.innerHTML = msg;
    div.style.position = "absolute";
    div.style.top = "14px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.background = "linear-gradient(115deg,#23242b 60%, #30323c 100%)";
    div.style.color = "#f1f3f6";
    div.style.padding = "13px 26px";
    div.style.fontSize = "1.19em";
    div.style.fontWeight = "bold";
    div.style.fontFamily = '"Comic Sans MS", "Comic Sans", cursive';
    div.style.borderRadius = "13px";
    div.style.zIndex = 2147483647;
    div.style.boxShadow = "0 2px 12px #181a1f44, 0 0.5px 4.5px #0008";
    div.style.textAlign = "center";
    div.style.letterSpacing = "0.7px";
    div.style.pointerEvents = "none";
    div.style.lineHeight = "1.38";
    div.style.width = "600px";     // Πλάτος όσο θέλεις (π.χ. 600px)
    div.style.maxWidth = "97vw";
    div.style.userSelect = "none";
    div.style.backdropFilter = "blur(2.3px)";
    div.style.opacity = 1;
    div.style.textShadow = "0 0.5px 2px #0006";
    div.style.border = "2px solid #8fa9be52";
    div.style.outline = "1.6px solid #f5f8ff70";
    div.style.outlineOffset = "-2.7px";
    if (container !== document.body && container.style.position !== "relative") {
        container.style.position = "relative";
    }
    setTimeout(() => {
        div.style.opacity = 0;
        div.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(()=>{ div.remove(); }, 350);
    }, 2100);

    container.appendChild(div);
}

// Δώσε σε όλα τα videos tabindex για να πιάνουν focus
document.querySelectorAll('video').forEach(v => v.setAttribute('tabindex', 0));
