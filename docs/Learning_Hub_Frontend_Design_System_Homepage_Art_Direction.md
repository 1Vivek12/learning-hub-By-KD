# Learning Hub by KD --- Frontend Design System & Homepage Art Direction

## Version 1.0 --- Premium EdTech Redesign Blueprint

> **Purpose:** This document is the visual/product-design source of
> truth for the Learning Hub by KD frontend redesign.
>
> **Important:** This is a frontend/UI specification. Do not modify
> backend architecture, Prisma, authentication, payments, LiveKit
> backend, database models, or APIs unless required only to consume
> already-existing data.

------------------------------------------------------------------------

# 1. Design Decision

The current homepage should **not be incrementally polished**.

The existing implementation has a clean foundation, but its visual
language still feels like a generic AI-generated EdTech/SaaS landing
page. The redesign should preserve working functionality and real data
while rebuilding the visual system and homepage compositions around a
deliberate product identity.

### Target perception

When a visitor opens Learning Hub by KD, the immediate impression should
be:

-   credible
-   practical
-   modern
-   Indian
-   education-first
-   professionally designed
-   calm and confident
-   premium without being flashy

It should **not** feel like:

-   an AI-generated SaaS template
-   a futuristic dashboard
-   a crypto/AI startup landing page
-   a collection of rounded cards
-   a neon/glassmorphism showcase

------------------------------------------------------------------------

# 2. Product Positioning

Learning Hub by KD is a practical digital-learning platform.

The interface should communicate:

> **Learn useful digital skills through structured courses, practical
> work, live learning, and verifiable certificates.**

Do not make unsupported claims about:

-   number of students
-   placements
-   salary outcomes
-   global recognition
-   industry partnerships
-   instructor credentials
-   ratings
-   testimonials
-   employment guarantees

If a claim is not backed by real application data, do not display it.

------------------------------------------------------------------------

# 3. Language Strategy

## Primary language

Hindi should feel natural and human.

Do NOT mechanically mix Hindi and English in every sentence.

Use English terms only where they are commonly understood in Indian
digital education.

### Preferred

**आज की ज़रूरत वाली डिजिटल स्किल्स सीखिए।**

**व्यावहारिक कोर्स, वास्तविक प्रोजेक्ट और लाइव क्लासेस के साथ ऐसी skills सीखिए
जिन्हें आप अपने काम में इस्तेमाल कर सकें।**

### Avoid

**सीखिए आज के काम की डिजिटल स्किल्स।**

**व्यावहारिक courses, real-world projects और live learning के साथ अपनी
digital skills को अगले स्तर तक ले जाएँ।**

The second style feels machine-generated and inconsistent.

------------------------------------------------------------------------

# 4. Typography System

Typography must create the premium feeling.

## Headings

Use a strong modern sans-serif with excellent Devanagari support.

Rules:

-   H1: 48--64px desktop
-   H1 line-height: approximately 1.05--1.15
-   H2: 34--44px
-   H3: 22--28px
-   Section titles must have clear hierarchy
-   Avoid excessive bold text everywhere

## Body

-   16--18px desktop for primary body copy
-   14--16px for secondary copy
-   14px minimum for meaningful UI text
-   line-height approximately 1.5--1.7

## Hindi

Never use tiny Hindi text.

Hindi needs sufficient size and line height to remain readable.

Do not use English and Hindi in the same sentence unless there is a
genuine product reason.

------------------------------------------------------------------------

# 5. Color System

Light mode is the primary visual identity.

## Core

-   Background: warm/neutral white
-   Primary text: deep navy
-   Secondary text: slate
-   Primary accent: restrained blue
-   Secondary accent: emerald
-   Success: emerald
-   Warning: amber
-   Error: red

Avoid:

-   neon cyan
-   excessive gradients
-   glowing text
-   glowing borders
-   dark futuristic backgrounds across the whole homepage

Dark mode should use the same semantic system rather than being a
separate visual identity.

------------------------------------------------------------------------

# 6. Layout System

Use a consistent centered content container.

### Desktop

-   max-width approximately 1180--1240px
-   generous horizontal breathing room
-   12-column grid where useful

### Tablet

-   reduce section padding
-   collapse asymmetric layouts intelligently

### Mobile

-   single-column layout
-   20--24px horizontal padding
-   no horizontal overflow
-   readable Hindi typography
-   CTA buttons remain comfortably tappable

------------------------------------------------------------------------

# 7. Spacing Philosophy

Do not create huge empty areas just to make a section look premium.

Premium does NOT mean excessive whitespace.

Use intentional rhythm:

-   small spacing inside components
-   medium spacing between related content
-   large spacing between major sections
-   visual anchors between sections

Every major empty area should have a design purpose.

------------------------------------------------------------------------

# 8. Border / Radius / Shadow Rules

Avoid excessive rounded cards.

### Recommended

-   small radius for controls
-   medium radius for course/media surfaces
-   large radius only for major visual compositions
-   subtle 1px borders
-   very soft shadows only where elevation is meaningful

### Never

Every section should NOT become:

`icon → heading → paragraph → rounded card`

This is the main pattern that currently creates the AI-template feeling.

------------------------------------------------------------------------

# 9. Homepage Architecture

The homepage should have this hierarchy:

1.  Header
2.  Hero
3.  Course discovery
4.  Why Learning Hub
5.  How learning works
6.  Live learning
7.  Certificates
8.  Final CTA
9.  Footer

Each section must have a different visual composition.

------------------------------------------------------------------------

# 10. Header

## Public visitor

Show:

-   Learning Hub by KD
-   Courses
-   Learning Paths
-   Live Classes
-   Search
-   compact account/action control

Do not expose:

-   Admin CMS
-   internal administration
-   unnecessary technical controls

## Logged-in student

Student Dashboard may be available through the account area.

Avoid filling the primary navigation with user-specific utilities.

## Header principle

The header should feel like a product navigation, not a control panel.

------------------------------------------------------------------------

# 11. Hero --- Primary Art Direction

The hero is the most important section.

## Left side

Eyebrow:

`LEARNING HUB BY KD`

H1:

**आज की ज़रूरत वाली डिजिटल स्किल्स सीखिए।**

Supporting copy:

**व्यावहारिक कोर्स, वास्तविक प्रोजेक्ट और लाइव क्लासेस के साथ ऐसी skills सीखिए
जिन्हें आप अपने काम में इस्तेमाल कर सकें।**

Primary CTA:

**कोर्स देखें →**

Secondary CTA:

**लाइव क्लासेस**

## Right side

Do NOT use:

-   empty grey placeholder
-   "Platform Ready"
-   abstract circular rings
-   futuristic dashboard HUD

Use a meaningful learning composition.

Preferred composition:

-   real course thumbnail when available
-   course title
-   lesson/progress information
-   subtle learning interface preview
-   optional certificate fragment

The visual should look like a real product experience.

It should not look like a stock SaaS illustration.

------------------------------------------------------------------------

# 12. Course Discovery

Section title:

**अपने लिए सही कोर्स चुनें**

Supporting copy:

**व्यावहारिक skills सीखने के लिए अपनी रुचि और लक्ष्य के अनुसार कोर्स चुनें।**

Use real published course data.

## When courses exist

Show 3--4 real courses in a visually strong horizontal/featured
arrangement.

Prioritize:

-   course image
-   title
-   concise description
-   lesson count if available
-   duration if available
-   price if appropriate and available
-   clear CTA

Do not overload every card with metadata.

## When no courses exist

Do NOT create a giant empty rectangle.

Use a compact, intentional empty state:

**कोर्स जल्द उपलब्ध होंगे**

**Learning Hub पर नए practical courses जल्द जोड़े जा रहे हैं।**

CTA:

**सभी कोर्स देखें →**

The empty state should occupy only the space necessary for the message.

------------------------------------------------------------------------

# 13. Why Learning Hub

Do not use four identical feature cards.

Use an editorial split layout.

## Main statement

**सिर्फ वीडियो नहीं --- सीखने का पूरा अनुभव।**

Then show three meaningful points:

### 01 --- Structured Learning

क्रमबद्ध lessons और learning paths के साथ सीखना आसान रखें।

### 02 --- Practical Work

सीखी हुई skills को assignments और projects के माध्यम से practice करें।

### 03 --- Live Interaction

जहाँ live sessions उपलब्ध हों, वहाँ instructors और learners के साथ सीधे जुड़ें।

Use subtle visual markers, not giant icon cards.

------------------------------------------------------------------------

# 14. How Learning Works

Title:

**Learning Hub पर सीखना आसान है।**

Create a horizontal or vertical story depending on viewport.

### 01

**कोर्स चुनें**

अपनी जरूरत के अनुसार course चुनें और learning शुरू करें।

### 02

**सीखें और practice करें**

Lessons पूरा करें और practical assignments पर काम करें।

### 03

**पूरा करें और certificate पाएँ**

Course पूरा होने पर अपनी उपलब्धि का verifiable certificate पाएँ।

Use:

-   large numbers
-   connecting line
-   subtle course/lesson/certificate visual

Do not use three isolated cards.

------------------------------------------------------------------------

# 15. Live Learning

Use a strong dark/navy section only as a deliberate contrast.

Title:

**Live Classes**

Copy:

**Recorded lessons के साथ जहाँ live sessions उपलब्ध हों, वहाँ instructors और
learners के साथ सीधे जुड़ें।**

## If upcoming classes exist

Show real classes:

-   title
-   date
-   time
-   instructor if actually available
-   join/view action

## If none exist

Compact empty state:

**अभी कोई upcoming live class नहीं है।**

**नई live sessions schedule होने पर वे यहाँ दिखाई देंगी।**

Do not fill a large section with an oversized empty card.

------------------------------------------------------------------------

# 16. Certificate Section

This should feel trustworthy rather than decorative.

Title:

**कोर्स पूरा करें और अपना certificate पाएँ।**

Supporting copy:

**Course पूरा होने के बाद मिलने वाला verifiable certificate आपकी learning
achievement को दर्ज करता है।**

Show a tasteful certificate preview.

Do not claim:

-   globally recognized
-   industry accredited
-   employer verified

unless the application actually supports those claims.

Certificate preview should be visually close to the real certificate
generated by the platform.

------------------------------------------------------------------------

# 17. Final CTA

Title:

**आज से अपनी अगली skill सीखना शुरू करें।**

Supporting copy:

**अपनी गति से सीखें, practical projects पर काम करें और अपनी learning journey
को आगे बढ़ाएँ।**

Primary CTA:

**कोर्स देखें →**

Do not use overly specific marketing language such as:

"Build Production-Grade Data Models"

unless the homepage is explicitly dedicated to that single course.

------------------------------------------------------------------------

# 18. Footer

Keep it simple.

### Brand

Learning Hub\
by KD

Short description:

**व्यावहारिक डिजिटल skills सीखने के लिए एक structured learning platform।**

### Learning

-   Courses
-   Learning Paths
-   Live Classes

### Company

-   About
-   Contact
-   FAQ

### Legal

-   Privacy Policy
-   Terms of Service
-   Refund Policy

Do not expose Admin CMS as a public marketing destination.

------------------------------------------------------------------------

# 19. Empty State Design

Empty states are part of the product design.

They must never look like errors.

Use:

-   short message
-   one useful explanation
-   optional CTA
-   compact visual

Avoid:

-   giant empty containers
-   placeholder illustrations
-   technical text
-   "Platform Ready"
-   internal status messages

------------------------------------------------------------------------

# 20. Course Card Design

Course cards should feel like education products, not SaaS feature
cards.

Preferred hierarchy:

1.  Thumbnail
2.  Course title
3.  One-line value proposition
4.  useful metadata
5.  CTA

Avoid:

-   too many badges
-   unnecessary icons
-   excessive borders
-   long paragraphs
-   fake ratings

------------------------------------------------------------------------

# 21. Motion

Motion should be subtle.

Allowed:

-   fade/slide on section entry
-   small hover transitions
-   button transitions
-   image scale on hover

Avoid:

-   floating objects
-   continuous animations
-   glowing effects
-   excessive parallax

Respect:

`prefers-reduced-motion`

------------------------------------------------------------------------

# 22. Accessibility

Every redesign must maintain:

-   semantic HTML
-   one clear H1
-   logical H2/H3 hierarchy
-   keyboard navigation
-   visible focus states
-   accessible contrast
-   meaningful alt text
-   real `<Link>` / `<a>` navigation
-   accessible buttons
-   reduced-motion support

------------------------------------------------------------------------

# 23. SEO / Content

Do not sacrifice semantic content for visual design.

Homepage should have:

-   one H1
-   descriptive section headings
-   meaningful page metadata
-   correct canonical URL
-   existing structured data preserved
-   no raw translation keys
-   no internal identifiers in visible UI

------------------------------------------------------------------------

# 24. Non-Negotiable Quality Bar

The final page should pass this test:

### If the Learning Hub logo is removed, can a reviewer still identify the product as a professional education platform?

YES.

### Does every section look like it belongs to the same design system?

YES.

### Does every section have a different visual composition?

YES.

### Does the page rely on repeated cards?

NO.

### Are there fake claims?

NO.

### Are there untranslated keys?

NO.

### Is Hindi natural?

YES.

### Does the homepage feel like a ₹1 lakh custom frontend rather than a modified template?

YES.

------------------------------------------------------------------------

# 25. Implementation Rule

Do not rewrite working backend functionality.

Preserve:

-   existing APIs
-   existing course data
-   existing live class data
-   existing authentication
-   existing certificate functionality
-   existing routing
-   existing CourseCard functionality where appropriate
-   existing accessibility improvements

The redesign is primarily a **visual system and composition rebuild**.

------------------------------------------------------------------------

# 26. Final Review Checklist

Before considering the redesign complete:

-   [ ] Hero no longer contains placeholder visual
-   [ ] Hero communicates Learning Hub immediately
-   [ ] Hindi copy is natural
-   [ ] No unnecessary Hindi/English mixing
-   [ ] Real courses render correctly
-   [ ] Empty course state is compact
-   [ ] Why Learning Hub is editorial, not a card grid
-   [ ] Learning process has strong visual storytelling
-   [ ] Live classes use real data
-   [ ] Live empty state is compact
-   [ ] Certificate preview is credible
-   [ ] Final CTA is strong
-   [ ] Footer is clean
-   [ ] Admin is not visible in public navigation
-   [ ] No fake statistics
-   [ ] No fake testimonials
-   [ ] No unsupported claims
-   [ ] No raw translation keys
-   [ ] No horizontal overflow
-   [ ] Mobile typography is readable
-   [ ] Light mode is primary
-   [ ] Dark mode remains coherent
-   [ ] Keyboard focus works
-   [ ] Production build passes
-   [ ] Backend files remain untouched

------------------------------------------------------------------------

# 27. Definition of Done

The redesign is complete only when the homepage looks like a
**deliberately designed education product**, not a developer-built
template.

A clean UI is not enough.

The page must have:

**Brand identity + hierarchy + visual storytelling + authentic copy +
real product data + restrained visual design.**
