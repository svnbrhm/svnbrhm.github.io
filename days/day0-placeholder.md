---
layout: day-layout.njk
day: 0
title: "Planning & Placeholder"
date: 2025-04-30 # Example date using YYYY-MM-DD format
overview: "This is a placeholder page demonstrating the structure for daily entries."
tags: days # Important: Tag needed for Eleventy collection
---

## Breakfast / Morning Coffee <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Cafe: Minimalist Brews
* **Vibe:** Quiet spot, focus on single-origin coffee, limited seating. Good for a quick, quality coffee.
* **Specialty:** Pour-over coffee, small selection of pastries.
* **Hours:** 08:00 - 16:00 (Closed Tuesdays)
* **Price:** ¥600 - ¥1000 / {{ 600 | toEuro(metadata.yenToEuroRate) }} - {{ 1000 | toEuro(metadata.yenToEuroRate) }} (approx.) per person
* **Queue:** Usually short (0-10 min), can be longer weekends around 10:00.
* **Reservations:** Not accepted.
* **Address:** 1 Chome-1-1 Placeholder St, Shibuya City, Tokyo 150-0000
* **Phone:** +81 3-1234-5678
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=1+Chome-1-1+Placeholder+St,+Shibuya+City,+Tokyo+150-0000" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`
* **Images:**
    <div class="image-slider">
        <img src="https://via.placeholder.com/300x200.png?text=Cafe+Interior" alt="Placeholder Cafe Interior">
        <img src="https://via.placeholder.com/300x200.png?text=Coffee+Cup" alt="Placeholder Coffee Cup">
        <img src="https://via.placeholder.com/300x200.png?text=Pastry" alt="Placeholder Pastry">
    </div>
* **Notes:** Cash only (example note). Limited English spoken.

### Alternative: Traditional Kissaten
* **Vibe:** Old-school Japanese coffee house, retro decor, smoking allowed (check first!), serves toast and simple breakfast sets.
* **Specialty:** Siphon coffee, "Morning Set" (Toast, Egg, Salad, Coffee).
* **Hours:** 07:00 - 19:00
* **Price:** ¥800 - ¥1500 / {{ 800 | toEuro(metadata.yenToEuroRate) }} - {{ 1500 | toEuro(metadata.yenToEuroRate) }} (approx.) per person
* **Notes:** Good for experiencing Showa-era atmosphere.

</div>

## Morning Activity <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Park: Serenity Garden
* **Vibe:** Small, beautifully landscaped traditional Japanese garden. Peaceful retreat from the city. Features a pond with koi fish and a small tea house (check operating hours).
* **Duration:** Approx. 1 hour (allow more if having tea).
* **Hours:** 09:00 - 17:00 (Last entry 16:30)
* **Price:** ¥300 / {{ 300 | toEuro(metadata.yenToEuroRate) }} (approx.) entrance fee. Tea separate.
* **Address:** 2 Chome-2-2 Park Ave, Meguro City, Tokyo 153-0000
* **Phone:** +81 3-9876-5432
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=2+Chome-2-2+Park+Ave,+Meguro+City,+Tokyo+153-0000" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`
* **Images:**
    <div class="image-slider">
        <img src="https://via.placeholder.com/300x200.png?text=Garden+Pond" alt="Placeholder Garden Pond">
        <img src="https://via.placeholder.com/300x200.png?text=Stone+Lantern" alt="Placeholder Stone Lantern">
        <img src="https://via.placeholder.com/300x200.png?text=Tea+House" alt="Placeholder Tea House">
    </div>
* **Info:** Established in the Edo period, known for its seasonal flowers. Check their website for bloom calendars. Good spot for quiet contemplation.

</div>

## Transport <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

* **Route:** Walk from Serenity Garden to nearest station (e.g., Placeholder Station - K08), take K-Line subway towards Central Hub.
* **Details:** Subway from K08 to K06 (Central Hub Station)
* **Line:** K-Line (Imaginary Line for example)
* **Duration:** Approx. 3 min ride + 5 min walk to station.
* **Cost:** ¥180 / {{ 180 | toEuro(metadata.yenToEuroRate) }} (approx.) (using IC card like Suica/Pasmo recommended)
* **Map/Directions:** `<a href="https://www.google.com/maps/dir/2+Chome-2-2+Park+Ave,+Meguro+City,+Tokyo+153-0000/Central+Hub+Station,+Tokyo" target="_blank" rel="noopener noreferrer">Directions Example Link</a>`
* **Notes:** Check train direction carefully. Use Google Maps or Japan Transit Planner apps (like Jorudan or Navitime) for real-time routing. IC cards can be purchased and topped up at station machines.

</div>

## Lunch <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Restaurant: Noodle Spot Alpha
* **Vibe:** Casual, counter-seating ramen shop. Quick service, popular with locals. Order via ticket machine at entrance.
* **Specialty:** Tonkotsu (pork broth) ramen. Offers variations like spicy miso or shoyu (soy sauce) base.
* **Hours:** 11:00 - 22:00 (or until soup runs out)
* **Price:** ¥1000 - ¥1800 / {{ 1000 | toEuro(metadata.yenToEuroRate) }} - {{ 1800 | toEuro(metadata.yenToEuroRate) }} (approx.) per bowl with toppings.
* **Queue:** Can be long (15-30 min) during peak lunch (12:00-13:30) and dinner hours. Shorter queues mid-afternoon.
* **Reservations:** Not accepted.
* **Address:** 3 Chome-3-3 Noodle Way, Chiyoda City, Tokyo 100-0000
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=Ramen+near+Central+Hub+Station,+Tokyo" target="_blank" rel="noopener noreferrer">Search Nearby Ramen</a>`
* **Images:**
    <div class="image-slider">
        <img src="https://via.placeholder.com/300x200.png?text=Ramen+Bowl" alt="Placeholder Ramen">
        <img src="https://via.placeholder.com/300x200.png?text=Ticket+Machine" alt="Placeholder Ticket Machine">
    </div>
* **Notes:** Ticket machines often have pictures but limited English. Pointing works! Learn basic ramen customization terms if desired (e.g., noodle hardness 'katame', broth richness 'kotteri').

</div>

## Afternoon Activity <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Museum: Modern Art Pavilion
* **Vibe:** Sleek, contemporary building showcasing post-war Japanese artists. Rotating special exhibitions alongside permanent collection. Well-lit galleries, informative descriptions (often with English).
* **Duration:** Approx. 1.5 - 2.5 hours.
* **Hours:** 10:00 - 18:00 (Closed Mondays, Last entry 17:30)
* **Price:** ¥1500 / {{ 1500 | toEuro(metadata.yenToEuroRate) }} (approx.) for permanent collection. Special exhibitions may have separate/additional fees. Check website.
* **Reservations:** Usually not required for permanent collection, but *highly recommended* or mandatory for popular special exhibitions (book online in advance).
* **Address:** 4 Chome-4-4 Museum Plaza, Minato City, Tokyo 105-0000
* **Phone:** +81 3-1111-2222
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=Modern+Art+Pavilion,+4+Chome-4-4+Museum+Plaza,+Minato+City,+Tokyo+105-0000" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`
* **Images:**
    <div class="image-slider">
        <img src="https://via.placeholder.com/300x200.png?text=Museum+Exterior" alt="Placeholder Museum Exterior">
        <img src="https://via.placeholder.com/300x200.png?text=Gallery+View" alt="Placeholder Gallery View">
        <img src="https://via.placeholder.com/300x200.png?text=Artwork+Example" alt="Placeholder Artwork">
    </div>
* **Info:** Has a nice museum shop and a small cafe overlooking a sculpture garden. Check website for current exhibitions during May 2025. Photography rules vary by gallery.

</div>

## Afternoon Coffee / Sweets <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Patisserie: Sweet Harmony
* **Vibe:** Elegant French-style patisserie with Japanese precision. Beautiful cakes, pastries, and chocolates. Small seating area available.
* **Specialty:** Mont Blanc, Matcha roll cake, seasonal fruit tarts.
* **Hours:** 10:00 - 19:00
* **Price:** ¥700 - ¥1500 / {{ 700 | toEuro(metadata.yenToEuroRate) }} - {{ 1500 | toEuro(metadata.yenToEuroRate) }} (approx.) per cake/pastry. Drinks separate.
* **Queue:** Usually short for takeaway, seating may require waiting (5-15 min).
* **Reservations:** Not usually needed for cafe seating, but can reserve whole cakes in advance.
* **Address:** 5 Chome-5-5 Sweet Street, Chuo City, Tokyo 104-0000
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=Patisserie+near+Modern+Art+Pavilion,+Tokyo" target="_blank" rel="noopener noreferrer">Search Nearby Patisseries</a>`
* **Images:**
    <div class="image-slider">
        <img src="https://via.placeholder.com/300x200.png?text=Cake+Display" alt="Placeholder Cake Display">
        <img src="https://via.placeholder.com/300x200.png?text=Mont+Blanc" alt="Placeholder Mont Blanc">
    </div>

</div>

## Dinner <button type="button" class="accordion-toggle" aria-expanded="false"><span class="visually-hidden">Toggle Section</span></button>
<div class="accordion-content">

### Example Izakaya: Local Hub
* **Vibe:** Lively Japanese pub (Izakaya). Counter and table seating. Can be noisy/smoky. Wide variety of small dishes (Japanese tapas), beer, sake, shochu. Good for groups or solo dining at the counter.
* **Specialty:** Yakitori (grilled skewers), Karaage (fried chicken), Sashimi, Agedashi Tofu. Seasonal specials often available.
* **Hours:** 17:00 - 23:30 (Last order 23:00)
* **Price:** ¥3000 - ¥6000 / {{ 3000 | toEuro(metadata.yenToEuroRate) }} - {{ 6000 | toEuro(metadata.yenToEuroRate) }} (approx.) per person, depending on how much you eat/drink.
* **Queue:** Can get busy, especially Fri/Sat nights. May need to wait (10-30 min) or try earlier/later.
* **Reservations:** Recommended for groups (4+ people), especially on weekends. Often possible via phone or booking sites like Tabelog/Gurunavi (may require Japanese).
* **Address:** 6 Chome-6-6 Izakaya Alley, Shinjuku City, Tokyo 160-0000
* **Map:** `<a href="https://www.google.com/maps/search/?api=1&query=Izakaya+near+Shinjuku+Station,+Tokyo" target="_blank" rel="noopener noreferrer">Search Nearby Izakayas</a>`
* **Notes:** English menu may or may not be available. Pointing at menu items or using translation apps can work. *Oshibori* (wet towel) provided. *Otoshi* (small appetizer charge) often applies per person.

</div>