async function connectWallet() {
  try {
    const provider = window?.phantom?.solana || window?.solana;

    if (!provider?.isPhantom) {
      document.getElementById("status").textContent =
        "Phantom wallet bulunamadı!";
      return;
    }

    const resp = await provider.connect();
    if (resp.publicKey.toString()) {
      document.getElementById("status").textContent =
        "Bağlantı başarılı! Public Key: " + resp.publicKey.toString();

      // Public key'i uzantıya geri gönder
      window.opener.postMessage(
        { type: "PHANTOM_CONNECTED", publicKey: resp.publicKey.toString() },
        "*"
      );

      // Sayfayı 1.5 saniye sonra kapat
      setTimeout(() => window.close(), 1500);
    }
  } catch (error) {
    document.getElementById("status").textContent =
      "Bağlantı hatası: " + error.message;
  }
}

window.addEventListener("load", connectWallet);
