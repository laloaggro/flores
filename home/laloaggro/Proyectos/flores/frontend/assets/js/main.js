// Call button functionality
const callButton = document.getElementById('callButton');
if (callButton) {
    callButton.addEventListener('click', function() {
        // Updated with the new phone number
        window.location.href = 'tel:+56963603177';
    });
}