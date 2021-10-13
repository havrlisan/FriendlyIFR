/* DISABLE FOCUS AFTER CLICK */
Array.from(document.getElementsByTagName("button"))
    .forEach(btn => btn.onmouseup = btn.blur);

/* AUTO PAUSE ON LOSE VISIBILITY */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) 
        pauseMovement(true); // TODO: Different approach for Test mode
});