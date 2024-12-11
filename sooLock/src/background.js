// Background script (service worker)

chrome.runtime.onInstalled.addListener(() => {
  console.log("Uzantı yüklendi!");
});

chrome.action.onClicked.addListener((tab) => {
  // connect.html dosyasını açan yeni sekme oluştur
  const phantomConnectURL = chrome.runtime.getURL("connect.html");

  const newTab = window.open(
    phantomConnectURL,
    "_blank",
    "width=400,height=600"
  );

  // Phantom Wallet'dan gelen mesajı dinle
  window.addEventListener("message", (event) => {
    if (event.origin !== "null") return; // Sandbox için `origin` "null" olur

    if (event.data.type === "PHANTOM_CONNECTED") {
      console.log("Phantom Wallet Public Key:", event.data.publicKey);

      // Cüzdan bağlantı bilgilerini alıp kullanabilirsiniz
      alert("Cüzdan başarıyla bağlandı! Public Key: " + event.data.publicKey);
    }
  });
});
