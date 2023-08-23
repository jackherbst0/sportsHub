document.addEventListener('DOMContentLoaded', () => {

    async function fetchNews(){
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBNews?recentNews=true&maxItems=10';
        const options = {
	    method: 'GET',
	    headers: {
		    'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
		    'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
	        }
        };
        try{
            const response = await fetch(url,options);
            const data = await response.json();
            console.log(data);
            for(const headline in data.body){
                const slides = document.getElementById("slideshow");
                const h = data.body[headline];
                slides.innerHTML = `
                <div class = "slide">
                    <a href="${h.link}">
                        <img src="${h.image}" alt="Slide">
                        <h2>${h.title}</h2>
                    </a>
                </div>
                `;
            }
            const slides = document.querySelectorAll('.slide');
            let currentSlideIndex = 0;

            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                slides[index].classList.add('active');
            }

            function nextSlide() {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                showSlide(currentSlideIndex);
            }

            showSlide(currentSlideIndex);
            setInterval(nextSlide, 5000);
        } catch (error){
            console.error(error);
        }
    }

    fetchNews().catch(error => {
        console.error("Error showing slides:", error);
    });
  });