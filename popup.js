// Εμφανίζει το επιλεγμένο speed ως selected κουμπί
chrome.storage.local.get(['selectedSpeed'], function(result) {
    let selected = result.selectedSpeed || 4;
    document.querySelectorAll('.speed-btn').forEach(btn => {
        if(Number(btn.dataset.value) === Number(selected)) btn.classList.add('selected');
    });
});

// Κουμπιά επιλογής ταχύτητας
document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.onclick = function() {
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        let speed = btn.dataset.value;
        chrome.storage.local.set({'selectedSpeed': speed});
        // Στέλνει μήνυμα σε όλα τα ενεργά tabs να δείξει ειδοποίηση
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {showSpeedNotification: true, speed: speed});
            });
        });
    };
});

// Donate κουμπιά
document.getElementById('donate-paypal').onclick = function() {
    window.open('https://www.paypal.me/ThomasThanos', '_blank');
};
document.getElementById('donate-revolut').onclick = function() {
    window.open('https://revolut.me/thomas2873', '_blank');
};
