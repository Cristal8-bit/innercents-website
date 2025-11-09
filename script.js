document.addEventListener('DOMContentLoaded', () => {

    // --- Parallax Scrolling Feature ---
    const hero = document.querySelector('.hero-section');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
        });
    }

    // --- Advanced Scroll Animation Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-animation-delay');
                    if(delay) {
                        entry.target.style.transitionDelay = delay;
                    }
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    } else {
        animatedElements.forEach(element => element.classList.add('is-visible'));
    }

    // --- RE-IMPLEMENTED & FIXED: Curriculum Display Logic ---
    const curriculumData = {
        "K-2": {
            title: "K-2: Foundations",
            topics: [
                { title: "Introduction to Money (K)", items: ["Cultural Stories About Sharing", "Family Money Traditions", "Counting With Friends", "SEL: Money Feelings"] },
                { title: "Family & Community Money (1)", items: ["Community Helper Heroes", "Local Business Friends", "Money Words We Know", "SEL: Giving & Thanks"] },
                { title: "Sharing & Fairness (2)", items: ["Community Resource Map", "Fair Trade Stories", "Cultural Celebrations", "SEL: Understanding Others"] }
            ]
        },
        "3-5": {
            title: "3-5: Community Economics",
            topics: [
                { title: "Community Resources (3)", items: ["Local Economic Systems", "Community Helper Voices", "Math Across Cultures", "SEL: Community Needs"] },
                { title: "Trade & Value (4)", items: ["Historical Trade Routes", "Indigenous Economics", "Math Games", "SEL: Beyond Money"] },
                { title: "Economic Justice (5)", items: ["Justice Movements", "Youth Leaders", "Math for Justice", "SEL: Standing Together"] }
            ]
        },
        "6-8": {
            title: "6-8: Systems & Advocacy",
            topics: [
                { title: "Financial Systems (6)", items: ["Banking System Basics", "Historical Inequities", "Alternative Economic Models", "SEL: System Impact Awareness"] },
                { title: "Media Literacy (7)", items: ["Advertisement Analysis", "Wealth Representation", "Digital Financial Literacy", "SEL: Resisting Pressure"] },
                { title: "Economic Advocacy (8)", items: ["Youth Movement Studies", "Community Projects", "Data for Justice", "SEL: Speaking Up"] }
            ]
        },
        "9-12": {
            title: "9-12: Systemic Change",
            topics: [
                { title: "Systemic Analysis (9)", items: ["Wealth Gap Analysis", "Historical Policy Review", "Economic Justice Movements", "SEL: Identity & Economics"] },
                { title: "Financial Activism (10)", items: ["Current Movement Studies", "Youth Activist Profiles", "Community Organizing", "SEL: Coalition Building"] },
                { title: "Personal Finance+ (11)", items: ["Critical Financial Planning", "Alternative Models", "Community Wealth", "SEL: Values-Based Decisions"] },
                { title: "Economic Justice (12)", items: ["Capstone Projects", "Community Impact", "Future Visioning", "SEL: Leadership"] }
            ]
        }
    };
    
    const gradeBandCards = document.querySelectorAll('.grade-card[data-grade-band]');
    const curriculumDisplay = document.getElementById('curriculum-display');
    const topicsListContainer = document.querySelector('.curriculum-topics-list');
    const detailsViewContainer = document.querySelector('.curriculum-details-view');

    if (gradeBandCards.length > 0 && curriculumDisplay) {
        gradeBandCards.forEach(card => {
            card.addEventListener('click', () => {
                const band = card.getAttribute('data-grade-band');
                const data = curriculumData[band];
                const isAlreadyActive = card.classList.contains('active');

                gradeBandCards.forEach(c => c.classList.remove('active'));
                
                if (isAlreadyActive) {
                    curriculumDisplay.classList.remove('visible');
                } else {
                    card.classList.add('active');
                    if (data) {
                        // Populate topics list
                        let topicsHtml = '<ul>';
                        data.topics.forEach((topic, index) => {
                            topicsHtml += `<li class="curriculum-topic-item" data-topic-index="${index}">${topic.title}</li>`;
                        });
                        topicsHtml += '</ul>';
                        topicsListContainer.innerHTML = topicsHtml;
                        
                        // Function to update details view
                        const updateDetails = (topicIndex) => {
                            const topic = data.topics[topicIndex];
                            let detailsHtml = `<h4>${topic.title}</h4><ul>`;
                            topic.items.forEach(item => {
                                detailsHtml += `<li>${item}</li>`;
                            });
                            detailsHtml += '</ul>';
                            detailsViewContainer.innerHTML = detailsHtml;

                            // Update active state in topic list
                            topicsListContainer.querySelectorAll('.curriculum-topic-item').forEach(item => item.classList.remove('active'));
                            topicsListContainer.querySelector(`[data-topic-index="${topicIndex}"]`).classList.add('active');
                        };

                        // Show the display and scroll to it
                        curriculumDisplay.classList.add('visible');
                        curriculumDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Add event listeners to new topic items
                        topicsListContainer.querySelectorAll('.curriculum-topic-item').forEach(item => {
                            item.addEventListener('click', (e) => {
                                const topicIndex = e.target.getAttribute('data-topic-index');
                                updateDetails(topicIndex);
                            });
                        });

                        // Initially load the first topic
                        updateDetails(0);
                    }
                }
            });
        });
    }
});