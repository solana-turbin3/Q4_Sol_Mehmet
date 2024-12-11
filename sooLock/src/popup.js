document.getElementById("connectButton").addEventListener("click", () => {
  // Vercel veya başka bir platformda barındırılan web sayfasını aç
  const phantomConnectURL = "https://yourwebsite.com/connect.html"; // Web sayfanızın URL'sini buraya koyun

  const newTab = window.open(
    phantomConnectURL,
    "_blank",
    "width=400,height=600"
  );

  // Web sayfasından gelen mesajları dinle
  window.addEventListener("message", (event) => {
    // Güvenlik kontrolü: mesajın doğru kaynaktan geldiğinden emin olun
    if (event.origin !== "https://yourwebsite.com") return;

    if (event.data.type === "PHANTOM_CONNECTED") {
      console.log("Phantom Wallet Public Key:", event.data.publicKey);

      // Cüzdan bağlantı bilgilerini alıp işlem yapabilirsiniz
      alert("Cüzdan başarıyla bağlandı! Public Key: " + event.data.publicKey);
    }
  });
});
