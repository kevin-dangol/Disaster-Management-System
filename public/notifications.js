//notifications
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(notification);

    //remove notfis after 5 sec
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

//check and fetch new disasters
async function checkForDisasterNotifications() {
    try {
        const response = await fetch('http://localhost:3001/api/disasters/events');
        const events = await response.json();

        const lastChecked = localStorage.getItem('lastDisasterCheck') || 0;
        const newEvents = events.filter(event => new Date(event.timestamp).getTime() > lastChecked);

        newEvents.forEach(event => {
            showNotification(`New ${event.type} in ${event.location}! Severity: ${event.severity}`, 'warning');
        });

        localStorage.setItem('lastDisasterCheck', Date.now());
    } catch (error) {
        console.error('Error checking for disaster notifications:', error);
    }
}

//run check on the page
document.addEventListener('DOMContentLoaded', () => {
    checkForDisasterNotifications();
    setInterval(checkForDisasterNotifications, 60000);
});