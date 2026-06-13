const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
// const themeToggle = document.getElementById("themeToggle");
const cursorGlow = document.querySelector(".cursor-glow");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

let countersStarted = false;
const statSection = document.querySelector(".stats-section");

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      runCounters();
    }
  },
  { threshold: 0.35 }
);

counterObserver.observe(statSection);

function runCounters() {
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1300;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = target >= 1000 ? `${value}+` : `${value}+`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = `${target}+`;
      }
    }

    requestAnimationFrame(update);
  });
}

const loadMoreBtn = document.getElementById("loadMoreProjects");
const hiddenProjects = document.querySelectorAll(".hidden-project");

let visibleProjectCount = 0;

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    const isFullyExpanded = visibleProjectCount >= hiddenProjects.length;

    if (isFullyExpanded) {
      hiddenProjects.forEach((project) => {
        project.classList.remove("show");
      });

      visibleProjectCount = 0;
      loadMoreBtn.innerHTML = '<span>Load More Projects</span> <i class="fas fa-chevron-down"></i>';

      document.getElementById("projects").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    hiddenProjects[visibleProjectCount].classList.add("show");
    visibleProjectCount++;

    if (visibleProjectCount >= hiddenProjects.length) {
      loadMoreBtn.innerHTML = '<span>Show Less</span> <i class="fas fa-chevron-up"></i>';
    }
  });
}

// CONTACT FORM SUBMISSION
const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactFormStatus = document.getElementById("contactFormStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactFormStatus.textContent = "";
    contactFormStatus.className = "form-status";

    contactSubmitBtn.disabled = true;
    contactSubmitBtn.textContent = "Sending...";

    const formData = new FormData(contactForm);

    const contactData = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      reason: formData.get("reason"),
      message: formData.get("message").trim()
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your message.");
      }

      contactFormStatus.textContent = result.message;
      contactFormStatus.classList.add("success");
      contactForm.reset();
    } catch (error) {
      contactFormStatus.textContent =
        error.message || "Something went wrong. Please try again.";
      contactFormStatus.classList.add("error");
    } finally {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.textContent = "Send Message";
    }
  });
}
