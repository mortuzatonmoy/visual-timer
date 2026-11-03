# Interval alerts for Edge

1. Download and extract [the repository ZIP](https://github.com/mortuzatonmoy/visual-timer/archive/refs/heads/main.zip).
2. Open `edge://extensions`, enable **Developer mode**, click **Load unpacked**, and select the extracted **interval-extension** folder containing `manifest.json`.
3. Refresh the timer and any work tabs that were already open. On [Visual timer](https://mortuzatonmoy.github.io/visual-timer/), look for “Alerts on other webpages are enabled in this browser.”
4. Set ten seconds, press **Start timer**, and switch to another ordinary webpage. At zero, the page displays **Time’s up!**. Dismiss the overlay from any tab to clear it across tabs.

The extension needs site access so it can draw over HTTP and HTTPS pages in the same browser profile. It stores timer deadlines in browser storage. Browser settings pages and protected viewers do not allow these overlays. To see the countdown over those tabs in desktop Edge, click **Show timer over other tabs** on the timer page.
