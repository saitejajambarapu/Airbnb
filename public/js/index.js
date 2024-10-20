let taxSwitch = document.getElementById("taxswitch");
    
    taxSwitch.addEventListener("click", ()=>{
      let taxPrice = document.getElementsByClassName("taxprice");
      let originalPrice = document.getElementsByClassName("originalprice");
      for(tp of taxPrice){
        if(tp.style.display != "inline"){
          tp.style.display = "inline";
        }else{
          tp.style.display = "none";
      }
      }
      for(op of originalPrice){
        if(op.style.display != "none"){
          op.style.display = "none";
        }else{
          op.style.display = "inline";
      }
      }
      
    })
    document.addEventListener('DOMContentLoaded', () => {
            const scrollableFilters = document.querySelector('.scrollable-filters');

            // Scroll on mouse wheel
            scrollableFilters.addEventListener('wheel', (event) => {
                event.preventDefault(); // Prevent default scrolling
                scrollableFilters.scrollLeft += event.deltaY; // Scroll horizontally based on vertical wheel movement
            });
        });
        
        document.addEventListener('DOMContentLoaded', (event) => {
        const flashMessage = document.getElementById('flash-message');

        if (flashMessage) {
            flashMessage.style.display = 'block'; // Show the message
            flashMessage.style.opacity = '1'; // Make it visible

            // Set a timer to hide the message after a specified duration
            setTimeout(() => {
                flashMessage.style.opacity = '0'; // Fade out
                setTimeout(() => {
                    flashMessage.style.display = 'none'; // Hide after fading out
                }, 500); // Match the CSS transition duration
            }, 1000); // Show for 1 seconds
        }
    });