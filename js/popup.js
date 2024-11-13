document.getElementById("playButton").addEventListener("click", () => {
  chrome.tabs.create({ url: "game.html" });
  console.log("Play button clicked, opening game.html");
});

document.getElementById("viewProgress").addEventListener("click", () => {
  chrome.tabs.create({ url: "progress.html" });
  console.log("Progress button clicked, opening progress.html");
});

document.getElementById("soundToggle").addEventListener("change", (event) => {
  localStorage.setItem("soundOn", event.target.checked);
  console.log("Sound toggled:", event.target.checked);
});

document.getElementById("fullscreenToggle").addEventListener("change", (event) => {
  localStorage.setItem("fullscreenOn", event.target.checked);
  console.log("Full screen toggled:", event.target.checked);
});
