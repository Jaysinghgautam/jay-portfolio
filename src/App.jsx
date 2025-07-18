import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// Lazy load the HomeContent component for better initial loading performance.
const LazyHomeContent = lazy(() => Promise.resolve({ default: HomeContent }));

// Main App component (wrapper for lazy loaded content)
// This component primarily handles the Suspense fallback for the lazy-loaded content.
function App() {
  return (
    // Suspense provides a fallback UI while LazyHomeContent is loading.
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          <p className="ml-4 text-xl">Loading...</p>
        </div>
      }
    >
      <LazyHomeContent />
    </Suspense>
  );
}

// Header Component
// This component provides the fixed navigation bar at the top of the page.
const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the mobile menu.
  const headerRef = useRef(null); // Ref for the header element to get its height.

  // handleScroll function handles smooth scrolling to different sections of the page.
  // It now calculates the scroll position to account for the fixed header and an offset.
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Get the current height of the header.
      const headerHeight = headerRef.current
        ? headerRef.current.offsetHeight
        : 0;
      // Calculate the target scroll position: element's top - header height - additional 2px padding.
      const scrollPosition = element.offsetTop - headerHeight - 2; // Subtract 2px for the extra padding.

      // Use window.scrollTo for precise control over the scroll position.
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
      setIsOpen(false); // Close mobile menu after clicking a link, ensuring it hides.
    }
  };

  // Helper component to render Lucide icons
  const LucideIcon = ({ name, size = 24, color = "currentColor" }) => {
    const [iconHtml, setIconHtml] = useState("");

    useEffect(() => {
      // Check if lucide object exists and the icon is available
      if (window.lucide && window.lucide[name]) {
        setIconHtml(
          window.lucide[name].toSvg({ width: size, height: size, color: color })
        );
      }
    }, [name, size, color]);

    return <div dangerouslySetInnerHTML={{ __html: iconHtml }} />;
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-sm z-50 shadow-lg py-4 px-8 rounded-b-xl"
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Portfolio title with gradient text and scroll to home functionality. */}
        <div
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text cursor-pointer"
          onClick={() => handleScroll("home")}
        >
          My Portfolio
        </div>
        {/* Mobile menu button (hamburger icon) for small screens. */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)} // Toggle mobile menu visibility.
          aria-label="Toggle navigation" // Accessibility improvement.
        >
          <LucideIcon name="Menu" size={30} /> {/* Lucide Menu icon */}
        </button>
        {/* Desktop navigation and mobile menu overlay. */}
        {/* The classes conditionally apply based on the 'isOpen' state for responsiveness. */}
        <ul
          className={`md:flex space-x-8 text-lg font-semibold ${
            isOpen ? "block" : "hidden"
          } md:block absolute md:static top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 transition-all duration-300 ease-in-out rounded-lg md:rounded-none`}
        >
          {/* Navigation links, each calling handleScroll on click and closing the menu. */}
          <li className="mb-2 md:mb-0">
            <a
              onClick={() => handleScroll("home")}
              className="block py-2 px-4 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition duration-300 cursor-pointer"
            >
              Home
            </a>
          </li>
          <li className="mb-2 md:mb-0">
            <a
              onClick={() => handleScroll("about")}
              className="block py-2 px-4 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition duration-300 cursor-pointer"
            >
              About
            </a>
          </li>
          <li className="mb-2 md:mb-0">
            <a
              onClick={() => handleScroll("projects")}
              className="block py-2 px-4 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition duration-300 cursor-pointer"
            >
              Projects
            </a>
          </li>
          <li className="mb-2 md:mb-0">
            <a
              onClick={() => handleScroll("skills")}
              className="block py-2 px-4 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition duration-300 cursor-pointer"
            >
              Skills
            </a>
          </li>
          <li className="mb-2 md:mb-0">
            <a
              onClick={() => handleScroll("contact")}
              className="block py-2 px-4 rounded-md text-gray-300 hover:text-white hover:bg-purple-700 transition duration-300 cursor-pointer"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// Footer Component
// This component displays copyright information and social media links.
const Footer = () => {
  // Helper component to render Lucide icons
  const LucideIcon = ({ name, size = 24, color = "currentColor" }) => {
    const [iconHtml, setIconHtml] = useState("");

    useEffect(() => {
      // Check if lucide object exists and the icon is available
      if (window.lucide && window.lucide[name]) {
        setIconHtml(
          window.lucide[name].toSvg({ width: size, height: size, color: color })
        );
      }
    }, [name, size, color]);

    return <div dangerouslySetInnerHTML={{ __html: iconHtml }} />;
  };

  return (
    <footer className="bg-gray-900 bg-opacity-90 py-8 mt-20 text-center text-gray-400 rounded-t-xl">
      <div className="max-w-7xl mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          {/* Social media links with Lucide icons. */}
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="GitHub profile"
          >
            <LucideIcon name="Github" size={30} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="LinkedIn profile"
          >
            <LucideIcon name="Linkedin" size={30} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Email me"
          >
            <LucideIcon name="Mail" size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

function HomeContent() {
  // State for Firebase auth and DB instances.
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // REMOVED: Ref for the 3D canvas element for Three.js.
  // const canvasRef = useRef(null);

  // Refs for sections to observe for scroll-triggered animations.
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null); // Ensure this ref is defined

  // State to track if sections are in view for animation.
  const [aboutInView, setAboutInView] = useState(false);
  const [projectsInView, setProjectsInView] = useState(false);
  const [skillsInView, setSkillsInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  // State for text animation in Hero section.
  const animatedRoles = [
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "UI/UX Designer",
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [typingSpeedRole, setTypingSpeedRole] = useState(150);

  // --- Firebase Initialization and Auth ---
  // This effect runs once on component mount to initialize Firebase and handle authentication.
  useEffect(() => {
    // Initialize Firebase app if config is available.
    if (Object.keys(firebaseConfig).length > 0) {
      try {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);
        setAuth(firebaseAuth);

        // signInUser function handles authentication using custom token or anonymously.
        const signInUser = async () => {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Firebase Auth Error:", error);
          }
        };

        // Listen for auth state changes to get the user ID.
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            // Generate a random UUID if no user is authenticated (anonymous session).
            setUserId(crypto.randomUUID());
          }
          setIsAuthReady(true); // Mark authentication as ready.
        });

        signInUser(); // Initiate sign-in process.
        return () => unsubscribe(); // Cleanup auth listener on component unmount.
      } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        setIsAuthReady(true); // Mark ready even if init fails to proceed with UI.
      }
    } else {
      console.warn("Firebase config not provided. Running without Firebase.");
      setUserId(crypto.randomUUID()); // Set a random ID if no Firebase config.
      setIsAuthReady(true); // Mark ready.
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // --- Text Typing Animation Effect for Hero Section ---
  // This effect manages the typing and deleting animation for the hero section text.
  useEffect(() => {
    let typer;
    const handleTyping = () => {
      const fullText = animatedRoles[currentRoleIndex];
      // Check if currently deleting text.
      if (isDeletingRole) {
        setDisplayedRole((prev) => fullText.substring(0, prev.length - 1)); // Remove one character.
        setTypingSpeedRole(50); // Faster deletion speed.
      } else {
        setDisplayedRole((prev) => fullText.substring(0, prev.length + 1)); // Add one character.
        setTypingSpeedRole(150); // Normal typing speed.
      }

      // Check if typing is complete.
      if (!isDeletingRole && displayedRole === fullText) {
        setTypingSpeedRole(1000); // Pause briefly at the end of typing.
        setIsDeletingRole(true); // Switch to deleting mode.
      } else if (isDeletingRole && displayedRole === "") {
        // Check if deletion is complete.
        setIsDeletingRole(false); // Switch to typing mode.
        setCurrentRoleIndex((prev) => (prev + 1) % animatedRoles.length); // Move to the next text.
        setTypingSpeedRole(500); // Pause briefly before starting next text.
      }
    };

    typer = setTimeout(handleTyping, typingSpeedRole); // Schedule the next typing step.
    return () => clearTimeout(typer); // Cleanup timeout on component unmount or re-render.
  }, [
    displayedRole,
    isDeletingRole,
    typingSpeedRole,
    currentRoleIndex,
    animatedRoles,
  ]); // Dependencies for re-running the effect.

  // --- Intersection Observer for Section Animations ---
  // This effect uses Intersection Observer API to detect when sections are in view
  // and applies entry animations.
  useEffect(() => {
    // Options for the Intersection Observer.
    const options = {
      root: null, // Use the viewport as the root.
      rootMargin: "0px",
      threshold: 0.3, // Trigger when 30% of the target is visible.
    };

    // Callback function when intersection changes.
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === aboutRef.current) {
          setAboutInView(entry.isIntersecting);
        } else if (entry.target === projectsRef.current) {
          setProjectsInView(entry.isIntersecting);
        } else if (entry.target === skillsRef.current) {
          setSkillsInView(entry.isIntersecting);
        } else if (entry.target === contactRef.current) {
          setContactInView(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Observe each section if its ref is available.
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (projectsRef.current) observer.observe(projectsRef.current);
    if (skillsRef.current) observer.observe(skillsRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    // Cleanup observer on component unmount.
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (projectsRef.current) observer.unobserve(projectsRef.current);
      if (skillsRef.current) observer.unobserve(skillsRef.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []); // Empty dependency array means this effect runs once after initial render.

  // Helper component to render Lucide icons
  const LucideIcon = ({ name, size = 24, color = "currentColor" }) => {
    const [iconHtml, setIconHtml] = useState("");

    useEffect(() => {
      if (window.lucide && window.lucide[name]) {
        setIconHtml(
          window.lucide[name].toSvg({ width: size, height: size, color: color })
        );
      }
    }, [name, size, color]);

    return <div dangerouslySetInnerHTML={{ __html: iconHtml }} />;
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-inter overflow-hidden">
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

      <Header />

      <div className="relative z-10 pt-20 p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section - Modified for enhanced attractiveness */}
        <section
          id="home"
          className="flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-100px)] text-left w-full py-16"
        >
          {/* Subtle radial gradient overlay for the hero section */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/50 to-gray-900 animate-pulse-light opacity-50 z-0"></div>

          {/* Left side: Text content and social icons */}
          <div className="relative z-10 flex-1 text-center md:text-left mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Hi, My name is{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Jaysingh
              </span>{" "}
              <br />
              and I am a passionate <br />
              Full stack Web <br />
              Developer having <br />
              Experience website and <br />
              Mobile application using <br />
              Skills
            </h1>
            {/* Dynamic "WEB DEVELOPER" text with typing animation */}
            {/* Updated with gradient text */}
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mt-6 mb-8 uppercase min-h-[48px] md:min-h-[64px]">
              {displayedRole}
              <span className="inline-block w-1 h-8 bg-purple-400 align-bottom animate-pulse"></span>{" "}
              {/* Typing cursor */}
            </p>
            {/* Social Icons - Using Lucide icons now, with actual (placeholder) links */}
            <div className="flex justify-center md:justify-start space-x-6 mt-4">
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="LinkedIn profile"
              >
                <LucideIcon name="Linkedin" size={30} />
              </a>
              <a
                href="https://facebook.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="Facebook profile"
              >
                <LucideIcon name="Facebook" size={30} />
              </a>
              <a
                href="https://github.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="GitHub profile"
              >
                <LucideIcon name="Github" size={30} />
              </a>
              <a
                href="https://youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="YouTube channel"
              >
                <LucideIcon name="Youtube" size={30} />
              </a>
              <a
                href="https://instagram.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="Instagram profile"
              >
                <LucideIcon name="Instagram" size={30} />
              </a>
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
              {/* Updated "Contact Me" button to scroll to contact section */}
              <button
                onClick={() => {
                  if (contactRef.current) {
                    contactRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 rounded-full bg-blue-600 text-white text-lg font-bold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Contact Me
              </button>
              <button className="px-8 py-3 rounded-full border border-blue-600 text-blue-300 text-lg font-bold shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105">
                See Resume
              </button>
            </div>
          </div>
          {/* Right side: Image - Updated for circular shape and hover effects */}
          <div className="flex-1 flex justify-center md:justify-end relative z-10">
            <img
              src="https://www.google.com/imgres?q=jaysingh%20gautam&imgurl=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2Fv2%2FD4D03AQHklcg_vswvpQ%2Fprofile-displayphoto-scale_200_200%2FB4DZeGuBOgGUAY-%2F0%2F1750311901112%3Fe%3D2147483647%26v%3Dbeta%26t%3DBHBhxMycrhYYgHOhe2CehqHmka8xv_onlRyAs--Y7Hk&imgrefurl=https%3A%2F%2Fin.linkedin.com%2Fin%2Fjaysingh-gautam-8a08692b1&docid=C2tvlNQUYrPTWM&tbnid=CES8IWYIDSPeTM&vet=12ahUKEwiJ0beJssWOAxVV-zgGHTDTCLcQM3oECBoQAA..i&w=200&h=200&hcb=2&itg=1&ved=2ahUKEwiJ0beJssWOAxVV-zgGHTDTCLcQM3oECBoQAA"
              alt=" "
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-purple-500/80"
              // Fallback for image loading errors
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/500x500/8B5CF6/FFFFFF?text=Image+Not+Found";
              }}
            />
          </div>
        </section>

        {/* About Section */}
        <section
          ref={aboutRef} // Attach ref for Intersection Observer
          id="about"
          className={`py-20 w-full text-center transition-all duration-1000 ease-out transform ${
            aboutInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-md">
            <span className="bg-gradient-to-r from-green-400 to-cyan-600 text-transparent bg-clip-text">
              About Me
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-center transform hover:scale-105 hover:shadow-purple-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-4 text-white">Who I Am</h3>
              <p className="text-lg leading-relaxed text-gray-300 text-center">
                I'm a passionate full-stack developer with a strong foundation
                in modern web technologies. I love bringing ideas to life
                through clean, efficient, and scalable code. My journey in
                development started with a curiosity for how things work, and it
                quickly evolved into a dedicated pursuit of creating impactful
                digital experiences.
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-center transform hover:scale-105 hover:shadow-purple-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-4 text-white">
                My Philosophy
              </h3>
              <p className="text-lg leading-relaxed text-gray-300 text-center">
                My approach to development is rooted in continuous learning and
                problem-solving. I believe in writing modular, testable code and
                adhering to best practices to ensure maintainability and
                robustness. User experience is paramount, and I strive to build
                interfaces that are intuitive and engaging.
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-center transform hover:scale-105 hover:shadow-purple-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-4 text-white">What I Do</h3>
              <p className="text-lg leading-relaxed text-gray-300 text-center">
                I specialize in building end-to-end web applications, from
                designing database schemas to crafting interactive frontends. My
                expertise spans across various frameworks and libraries,
                allowing me to adapt to different project requirements and
                deliver comprehensive solutions.
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-center transform hover:scale-105 hover:shadow-purple-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Looking Forward
              </h3>
              <p className="text-lg leading-relaxed text-gray-300 text-center">
                I am always eager to explore new technologies and take on
                challenging projects that push my boundaries. I am committed to
                delivering high-quality work and collaborating effectively with
                teams to achieve shared goals. Let's build something amazing
                together!
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          ref={projectsRef} // Attach ref for Intersection Observer
          id="projects"
          className={`py-20 w-full text-center transition-all duration-1000 ease-out transform ${
            projectsInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-md">
            <span className="bg-gradient-to-r from-teal-400 to-blue-600 text-transparent bg-clip-text">
              My Projects
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Project 1: Interactive Dashboard */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-start text-left transform hover:scale-105 hover:shadow-teal-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Project Alpha: Interactive Dashboard
              </h3>
              <p className="text-lg leading-relaxed text-gray-200">
                This project involved developing a highly responsive and
                interactive dashboard for data visualization. It features
                real-time data updates, customizable widgets, and a
                user-friendly interface built with React and D3.js. Performance
                optimization was a key focus, ensuring smooth interactions even
                with large datasets.
              </p>
            </div>
            {/* Project 2: E-commerce Platform */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-start text-left transform hover:scale-105 hover:shadow-teal-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Project Beta: E-commerce Platform
              </h3>
              <p className="text-lg leading-relaxed text-gray-200">
                A full-stack e-commerce solution, this platform supports product
                listings, secure payment gateways, user authentication, and
                order management. It was built using Next.js for the frontend,
                Node.js with Express for the backend, and MongoDB for database
                management, emphasizing scalability and security.
              </p>
            </div>
            {/* Project 3: Mobile Game Development */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-start text-left transform hover:scale-105 hover:shadow-teal-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Project Gamma: Mobile Game Development
              </h3>
              <p className="text-lg leading-relaxed text-gray-200">
                This project explored game development with a focus on
                cross-platform compatibility. It's a casual puzzle game
                implemented using JavaScript and Canvas API, featuring dynamic
                animations, sound effects (Tone.js), and a leader board system,
                providing an engaging user experience.
              </p>
            </div>
            {/* Project 4: AI-Powered Chatbot */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between items-start text-left transform hover:scale-105 hover:shadow-teal-500/50 transition duration-300">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Project Delta: AI-Powered Chatbot
              </h3>
              <p className="text-lg leading-relaxed text-gray-200">
                Designed a conversational AI chatbot integrated into a web
                application. The chatbot leverages Google's Gemini API for
                natural language understanding and generation, providing helpful
                responses and performing tasks for users. The frontend was built
                with React, focusing on a seamless chat interface.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section
          ref={skillsRef} // Attach ref for Intersection Observer
          id="skills"
          className={`py-20 w-full text-center transition-all duration-1000 ease-out transform ${
            skillsInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-md">
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
              My Skills
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Skill 1: HTML & CSS */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-orange-500/50 transition duration-300">
              <div className="text-6xl text-orange-500 mb-4">
                <LucideIcon name="Html5" size={60} /> {/* Lucide HTML icon */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">HTML & CSS</h3>
              <p className="text-gray-300 text-center">
                Mastery in semantic HTML5 and modern CSS3, including Flexbox,
                Grid, and responsive design principles with Tailwind CSS.
              </p>
            </div>

            {/* Skill 2: JavaScript & React.js */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-blue-400/50 transition duration-300">
              <div className="text-6xl text-blue-400 mb-4">
                <LucideIcon name="React" size={60} /> {/* Lucide React icon */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                JavaScript & React.js
              </h3>
              <p className="text-gray-300 text-center">
                Proficient in ES6+ JavaScript, building dynamic user interfaces
                with React, hooks, context API, and state management libraries.
              </p>
            </div>

            {/* Skill 3: Next.js */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-gray-300/50 transition duration-300">
              <div className="text-6xl text-gray-300 mb-4">
                {/* Lucide Next.js icon (if available) or fallback SVG */}
                <LucideIcon name="Vercel" size={60} />{" "}
                {/* Vercel icon as a proxy for Next.js */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Next.js</h3>
              <p className="text-gray-300 text-center">
                Experience in building server-side rendered and static-generated
                React applications with Next.js for optimal performance and SEO.
              </p>
            </div>

            {/* Skill 4: Node.js & Express */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-green-500/50 transition duration-300">
              <div className="text-6xl text-green-500 mb-4">
                <LucideIcon name="Cable" size={60} />{" "}
                {/* Lucide Cable icon for Node.js */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                Node.js & Express
              </h3>
              <p className="text-gray-300 text-center">
                Backend development with Node.js and Express, creating RESTful
                APIs, handling authentication, and integrating with databases.
              </p>
            </div>

            {/* Skill 5: Databases (MongoDB, Firestore) */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-purple-500/50 transition duration-300">
              <div className="text-6xl text-purple-500 mb-4">
                <LucideIcon name="Database" size={60} />{" "}
                {/* Lucide Database icon */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Databases</h3>
              <p className="text-gray-300 text-center">
                Proficiency in NoSQL databases like MongoDB and cloud-based
                solutions like Google Firestore for flexible data storage.
              </p>
            </div>

            {/* Skill 6: Cloud Platforms (Firebase, Vercel) */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center transform hover:scale-105 hover:shadow-yellow-400/50 transition duration-300">
              <div className="text-6xl text-yellow-400 mb-4">
                <LucideIcon name="Cloud" size={60} /> {/* Lucide Cloud icon */}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                Cloud Platforms
              </h3>
              <p className="text-gray-300 text-center">
                Deployment and management of applications on platforms like
                Firebase and Vercel, including serverless functions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          ref={contactRef} // Attach ref for Intersection Observer
          id="contact"
          className={`py-20 w-full text-center transition-all duration-1000 ease-out transform ${
            contactInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-md">
            <span className="bg-gradient-to-r from-red-400 to-pink-600 text-transparent bg-clip-text">
              Contact Me
            </span>
          </h2>
          <div className="max-w-xl mx-auto bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700">
            {/* Social Media Links added above the form */}
            <p className="text-lg text-gray-300 mb-6">
              Connect with me on social media:
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="LinkedIn profile"
              >
                <LucideIcon name="Linkedin" size={30} />
              </a>
              <a
                href="https://github.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="GitHub profile"
              >
                <LucideIcon name="Github" size={30} />
              </a>
              <a
                href="https://instagram.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="Instagram profile"
              >
                <LucideIcon name="Instagram" size={30} />
              </a>
              <a
                href="https://twitter.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
                aria-label="Twitter profile"
              >
                <LucideIcon name="Twitter" size={30} />
              </a>
            </div>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-left text-lg font-semibold text-gray-200 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  placeholder="Your Name"
                  aria-label="Name input field"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-left text-lg font-semibold text-gray-200 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  placeholder="your.email@example.com"
                  aria-label="Email input field"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-left text-lg font-semibold text-gray-200 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y transition duration-300"
                  placeholder="Your message..."
                  aria-label="Message textarea field"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-pink-700 transition duration-300 transform hover:scale-105"
                aria-label="Send message"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
