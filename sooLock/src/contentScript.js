// Web sayfasına bir script enjekte edin
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
document.head.appendChild(script);

// Web sayfasından mesajları dinleyin
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data.type) return;

  if (event.data.type === "PHANTOM_CONNECTED") {
    chrome.runtime.sendMessage({
      action: "PHANTOM_CONNECTED",
      publicKey: event.data.publicKey,
    });
  }
});
