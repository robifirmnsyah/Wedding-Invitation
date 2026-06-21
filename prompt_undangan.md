You are a senior frontend engineer and creative UI designer.

Build a production-ready digital wedding invitation website.

---

# 💍 PROJECT OVERVIEW

Create a premium digital wedding invitation website for:

Groom: Robi Firmansyah
Bride: Tiara Nurillatiffah

Theme:
Watercolor Mountain Valley Wedding (Islamic + Sundanese aesthetic) — warm, candid, and emotionally cute rather than stiff/formal luxury. Inspired by the reference video "Tiba" theme (digimo.id).

Style:
Soft, warm, candid, storytelling-driven. Premium watercolor illustration combined with playful, heartfelt touches — like flipping through a beautifully made personal scrapbook, not a corporate template.

This is NOT a normal website.
It is an interactive emotional experience.

---

# 🧠 CORE EXPERIENCE GOAL

When users open the website, they should feel:

* Entering a watercolor mountain valley at sunrise
* Birds flying gently across a soft morning sky
* Floating flowers, leaves, and petals
* Calm Islamic wedding warmth with a candid, "real love story" feeling
* Premium but heartfelt — emotionally close, not distant/formal

---

# 🧱 TECH STACK

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* GSAP ScrollTrigger
* Lenis Smooth Scroll
* React Icons

---

# 🎨 DESIGN SYSTEM

## Primary Color

* Olive Green: #708238

## Supporting Colors

* Ivory: #FAF8F3
* Cream: #F5F0E6
* Sage Mist: #DCE4D3
* Beige: #E9E1D3
* Soft Gray Text: #3B3B3B

## Typography

* Heading: rounded, warm, slightly handwritten/brush display font (e.g. "Fredoka", "Baloo 2", or "Caveat"/"Permanent Marker" for accent words) — NOT a stiff formal serif. Should feel friendly and personal, similar to the couple's name styling in the reference video.
* Subheading: Cormorant Garamond (soft contrast against the rounded heading font)
* Body: Poppins
* Caption/accent text (used on photo overlays): casual brush-script font (e.g. "Caveat", "Permanent Marker") for short captions like the "Under The Blue" style text seen on gallery photos

---

# 🌿 VISUAL STYLE DIRECTION

Use ONLY:

* Watercolor mountain valley illustration (rolling hills, distant misty mountains, soft clouds)
* Flying bird silhouettes animated across the sky
* Soft rising/setting sun with radial glow
* Wildflower meadow foreground (tulips, daisies, poppies, small wild blooms)
* White roses, peonies, eucalyptus, olive leaves as supporting floral accents
* Transparent floral assets, floating particles, parallax depth layers
* Candid, real, warm couple photography (grass fields, sky shots, hand gestures like a small heart shape, playful poses) — not stiff studio poses
* Small cute illustrated accents are allowed (e.g. a pair of illustrated animals/birds as a mascot motif near the gift section) if they add warmth — keep them subtle and tasteful, not childish

NO:

* 3D cartoon
* Realistic CGI
* Modern neon style
* Heavy gradients
* Overly stiff/corporate "luxury hotel" formality

---

# 📁 ASSET SYSTEM (IMPORTANT)

All assets must be layered for animation:

/public/assets/
/backgrounds/
/florals/
/particles/
/birds/
/music/
/gallery/

### Layers (parallax depth):

* Layer 1 (far): sky, clouds, distant misty mountains
* Layer 2 (mid): rolling green hills, large watercolor tree, animated flying birds
* Layer 3 (near/foreground): wildflower meadow, floating petals/leaves

---

# 🎬 WEBSITE SECTIONS

## 1. LOADING SCREEN

* Watercolor logo reveal
* Soft fade animation
* Floating petals
* Elegant fade into website

---

## 2. OPENING COVER (HERO)

Text:

Robi Firmansyah
&
Tiara Nurillatiffah

Button:
"Open Invitation"

Features:

* Guest name personalization (?to=NamaTamu)
* Fullscreen watercolor mountain valley background with parallax layers
* Animated flying birds crossing the sky
* Soft sun glow with gentle blooming flower animation in foreground

---

## 3. ISLAMIC VERSE SECTION

Show:

QS. Ar-Rum 21

Style:

* Centered typography (rounded heading font for emphasis words, Cormorant Garamond for the verse body)
* Soft glowing watercolor background
* Fade-in calligraphy animation

---

## 4. OUR STORY / LOVE JOURNEY (NEW SECTION)

Vertical timeline of the couple's relationship milestones, e.g.:

* First Met
* In Relationship
* Engagement (if applicable)
* Toward Marriage

Each milestone includes:

* Candid couple photo (real photo, not illustration)
* Short story text (in Indonesian, warm and personal tone)
* Floating leaf/petal accents between timeline points
* Scroll-reveal stagger animation per milestone (GSAP ScrollTrigger)

---

## 5. BRIDE & GROOM

IMPORTANT:
Use REAL PHOTO (not illustration)

Layout:

* Circular photo frames with rope/knot decorative border (nautical-garden style, as in reference)
* Left: Groom photo
* Right: Bride photo (hijab elegant framing)

Include:

* Full name
* Parents name
* Instagram link

Style:

* Circular rope-border frame (primary) — olive green floral accents around the frame as secondary detail
* Warm grass/garden backdrop tone behind the circle

---

## 6. SAVE THE DATE

* Large countdown timer
* Floral circle decoration
* Animated petals floating

---

## 7. EVENT DETAILS

Sections:

* Akad Nikah
* Resepsi

Include:

* Date
* Time
* Location
* Google Maps embed
* Add to calendar button

Style:
Arch/oval-shaped card containing a small watercolor illustration scene (couple silhouette under a floral arch) as the card's background, with event text overlaid on top — mountain valley visible behind the card.

---

## 8. GALLERY

Features:

* Candid photo collage grid (video-dump / scrapbook aesthetic) mixing close-ups, wide shots, and playful moments (e.g. hands forming a heart, walking shots, grass-level shots)
* Short brush-script captions overlaid on some photos (e.g. a custom phrase per couple, similar to "Under The Blue" style text)
* Lightbox fullscreen
* Swipe mobile support
* Lazy loading images

Animation:

* Scroll reveal stagger
* Smooth fade in

---

## 9. WEDDING WISHES

Features:

* Guestbook input
* Name + message + attendance
* Pagination or infinite scroll

Style:

* Paper card watercolor texture
* Soft shadow

---

## 10. DIGITAL GIFT

Include:

* Bank accounts
* QRIS payment
* Copy button

Style:

* Warm card UI with olive accent and floral corners
* Optional: small cute illustrated mascot pair (e.g. two small animals/birds) near the heading for warmth — subtle, not overpowering the elegant tone

---

## 11. CLOSING SECTION

Text:

"With heartfelt gratitude, we invite your prayers and blessings"

Robi Firmansyah
&
Tiara Nurillatiffah

Background:
Golden watercolor mountain valley sunset

Animation:

* Floating petals upward
* Soft fade out

---

# 🎞️ ANIMATION SYSTEM

## Framer Motion:

* Fade in/out
* Slide up
* Scale smooth

## GSAP ScrollTrigger:

* Parallax mountain valley layers (sky, hills, meadow)
* Animated flying birds crossing the sky on scroll/loop
* Floating leaves and petals
* Depth movement

## Global Effects:

* Floating petals
* Light particles
* Smooth scroll (Lenis)
* Subtle hover interactions

---

# ⚙️ CONFIG SYSTEM (IMPORTANT)

Create:

/config/wedding.json

```json
{
  "couple": {
    "groom": "Robi Firmansyah",
    "bride": "Tiara Nurillatiffah"
  },
  "loveStory": [
    { "title": "First Met", "story": "", "photo": "" },
    { "title": "In Relationship", "story": "", "photo": "" }
  ],
  "event": {
    "akad": {},
    "resepsi": {}
  },
  "gallery": [],
  "gift": [],
  "music": "violin-wedding.mp3",
  "quote": "QS Ar-Rum 21"
}
```

---

# 🎧 MUSIC SYSTEM

* Violin wedding instrumental
* Autoplay AFTER user clicks "Open Invitation"
* Floating music control button (small, top corner, as in reference)

---

# 📱 UX REQUIREMENTS

* Mobile first design
* Smooth scroll experience
* Personalized URL support: /?to=NamaTamu
* Warm, gentle transitions between sections
* No jarring layout shifts

---

# ⚡ PERFORMANCE

* Lighthouse score > 90
* Lazy load images
* Optimize GSAP animations
* Use next/image for all images
* Avoid heavy re-renders

---

# 🧩 COMPONENT STRUCTURE

src/
app/
components/
sections/
assets/
config/
hooks/
lib/
animations/

---

# 🌟 FINAL OUTPUT REQUIREMENT

The final website must feel like:

> A warm, candid, watercolor mountain-valley Islamic wedding invitation that feels like flipping through a real, heartfelt love story — premium in craft, but emotionally close and personal rather than cold/formal luxury.

It should NOT feel like a template.
It should feel like a custom-designed wedding experience worth premium pricing — while still feeling like *them*, not a generic hotel brochure.
