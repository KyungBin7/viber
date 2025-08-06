### UI Specification

Hello, I am the `ux-expert` agent. Based on the brief, architecture, and PRD, I have created a UI specification that maximizes the use of `react-bits`.

#### 1. Common Design System
* **Overall Look & Feel:** Based on minimalism, with a focus on 'impact' delivered through `react-bits`'s dynamic animations.
* **Color Palette:**
    * **Primary Color:** `#FFFFFF` (main background)
    * **Secondary Color:** `#1A1A1A` (text, dark mode background)
    * **Accent Color:** `#FF4C3B` (accents, interactive elements)
    * **Neutral Color:** `#D3D3D3` (dividers, disabled elements)
* **Font:** Use a highly legible and modern sans-serif font (e.g., Noto Sans KR, Pretendard).

#### 2. UI/UX Specifications per Page

**A. Home Page**

* **Main Visual Section:**
    * **Background:** Use `react-bits`'s **`Aurora` or `Orb`** component to apply a dynamic and mysterious 3D background animation. This will be the core element that visually expresses the agency's technical skill.
    * **Slogan Text:** Apply one of `react-bits`'s **`Text Animations`** to the agency's slogan. For example, use a `Split Text` effect where the text breaks apart and reassembles to leave a strong impression.
    * **Scroll Down Prompt:** Place a small, minimalist animation (e.g., a downward arrow) at the bottom center to encourage scrolling.

* **About Us Section:**
    * **Entrance Animation:** Apply a smooth fade-in animation from the bottom as the user scrolls, or a `Fade In` effect to the section title and content.
    * **Core Values:** Display 3-4 core values with icons. On mouse hover, apply a simple `react-bits` **`Hover` animation** to the icons to enhance interaction.

* **CTA (Call To Action) Section:**
    * **Button Design:** While not a native `react-bits` component, we will combine custom CSS with `react-bits` animation elements to design a button with a visual effect on click, such as a glowing effect.

**B. Portfolio List Page**

* **Layout:** A 3-column grid layout with cards.
* **Card Design:**
    * Each card will include a project image, title, and a brief description.
    * **Mouse Hover Effect:** When the mouse pointer hovers over a card, it will slightly enlarge or apply a `react-bits` `Glow` effect to draw attention.
    * **Transition Effect:** When clicking on a card to navigate to the detail page, we will use Next.js's page transition animations (e.g., integrating with a `motion` library) for a smooth transition.

**C. Portfolio Detail Page**

* **Main Image Gallery:**
    * **Component Usage:** Use `react-bits`'s **`FlyingPosters`** component to organize project images in an immersive 3D gallery format. As the user moves the mouse or scrolls, the images will move within a 3D space, maximizing the sense of immersion.
    * **Interaction:** Users can click on images within the gallery to enlarge them or swipe left/right to view other images.

* **Project Information:**
    * Project information (overview, tech stack, result links) will be designed with a minimalist layout for high readability.
    * Apply a fade-in animation to the text as the user scrolls to maintain a dynamic feel.

**D. Contact Page**

* **Contact Form:**
    * **Input Fields:** When a user focuses on an input field (name, email, message), the field's border will smoothly highlight with an animation.
    * **Button:** The submit button will have the same visual effect as the CTA button on the main page.

* **Map Component:**
    * The map showing the agency's location will be loaded statically initially and will only be dynamically loaded on scroll (Lazy Loading) to optimize page performance.