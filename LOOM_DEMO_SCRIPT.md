# Flight Search Engine - Loom Demo Script (3-4 mins)

## TIMING BREAKDOWN:
- **Introduction**: 30 seconds
- **Architecture Overview**: 45 seconds  
- **Code Walkthrough**: 1.5 minutes
- **Live Demo**: 1 minute
- **Key Decisions**: 45 seconds
- **Buffer/Closing**: 30 seconds

---

## SCRIPT (READ THIS WHILE RECORDING)

### 1. INTRODUCTION (0:00-0:30)
*Show: homepage in browser*

**"Hi! I've built a **Flight Search Engine** - a modern web app that lets you search real-time flight prices, filter by airlines and stops, and track price trends.**

**It's built with Next.js, React, and integrates with the Amadeus API for real flight data. Let me walk you through how it's architected and the key decisions I made.**"

---

### 2. ARCHITECTURE OVERVIEW (0:30-1:15)
*Show: Project structure in VS Code file tree*

**"The app is structured in three main layers:**

1. **Frontend** - React components using Tailwind CSS for beautiful, responsive UI
2. **API Layer** - Next.js server-side API route that safely calls Amadeus API  
3. **State Management** - Zustand for managing flight search results and filters

**I chose this architecture because:**
- **Next.js App Router** gives us server-side rendering for better SEO and performance
- **Zustand** is lightweight and perfect for this data flow - no Redux complexity
- **Server-side API route** keeps API keys secure and prevents CORS issues
- **Type-safe with TypeScript** - catches bugs before runtime**"

---

### 3. CODE WALKTHROUGH (1:15-2:45)

#### A) Types File (1:15-1:30)
*Open: `types/flight.ts`*

**"First, let's look at the type definitions. This is the **contract** for our entire app:**

- **FlightOffer** - The main flight object from Amadeus
- **FlightSegment** - Individual flight legs (connections)
- **FlightCardData** - Simplified version for UI display
- **FlightFilters** - What users can filter by (price, airlines, stops)

**Having strong types ensures data consistency across the app.**"

---

#### B) API Route (1:30-1:50)
*Open: `app/api/flights/route.ts`*

**"This is the **server-side API endpoint** that handles flight searches:**

- Takes search parameters (origin, destination, date, passengers)
- Validates inputs before calling Amadeus
- Calls the Amadeus API safely with our API key stored in `.env.local`
- Transforms the response into our frontend-friendly format
- Returns JSON to the client

**Key decision**: I put API calls on the server side because:
- **Security** - API keys stay on the server, never exposed to frontend
- **No CORS issues** - Server-to-server communication
- **Better performance** - We can cache results if needed**"

---

#### C) State Management (1:50-2:10)
*Open: `store/flightStore.ts`*

**"Zustand store manages our flight data. It holds:**

- **Raw data** - All flights from the search
- **Filters** - User's selected filters (price range, airlines)
- **Computed data** - Filtered results, price chart data, available airlines
- **Actions** - Methods to update filters, clear search, etc.

**Why Zustand?** Simple, fast, no boilerplate. Perfect for this app.**"

---

#### D) Search Form Component (2:10-2:30)
*Open: `components/search/SearchForm.tsx`*

**"The SearchForm is where users input their search criteria. It uses:**

- **React Hook Form** for form state management
- **Zod validation** to ensure correct input formats
- **AirportAutocomplete** component with real airport data
- **Calls our `/api/flights` endpoint** and stores results in Zustand

**User experience is smooth with loading states and error handling.**"

---

#### E) Flight Results (2:30-2:45)
*Open: `components/results/FlightList.tsx` and `components/results/FlightCard.tsx`*

**"The results page displays all matching flights in cards. Each card shows:**

- Departure & arrival times
- Duration, stops, airline name
- Price and booking button

**Plus we have:**
- **FilterPanel** - For filtering by price, airline, stops
- **PriceTrendChart** - Recharts visualization showing price trends over dates
- **Responsive design** - Works on mobile, tablet, desktop**"

---

### 4. LIVE DEMO (2:45-3:45)
*Run: `npm run dev` - App should be running at http://localhost:3000*

**"Let me show you it in action:**

1. **Open the app** - Beautiful landing page with search form
2. **Search a flight** - [Type: New York (JFK) to London (LHR), tomorrow, 1 adult]
3. **Show results** - Real flights appear with prices
4. **Try filters** - Filter by price range, airline, number of stops
5. **Show price chart** - Price trends visualization
6. **Click a flight** - Shows detailed itinerary

**Notice how fast it is and how smooth the filtering is - that's Zustand's reactivity in action.**"

---

### 5. KEY DECISIONS & TRADE-OFFS (3:45-4:30)

**"Here are the **design decisions** I made and **why**:**

1. **Next.js + React** 
   - Full-stack JavaScript - one language for frontend and backend
   - Built-in API routes - no separate backend needed

2. **Zustand over Redux**
   - Less boilerplate, easier to learn
   - Smaller bundle size
   - Perfect for this scope - no overkill

3. **Tailwind CSS**
   - Rapid development with utility-first styling
   - Responsive out of the box
   - Beautiful, modern look

4. **TypeScript**
   - Prevents runtime errors with type safety
   - Better IDE autocomplete and refactoring
   - Self-documenting code

5. **Amadeus API**
   - Real flight data - not mock data
   - Industry standard for travel APIs
   - Comprehensive flight information

**The goal was to build a **production-quality app** that's **fast, type-safe, and maintainable** - not something overly complex.**"

---

### 6. CLOSING (4:30+)

**Thanks for watching!**"

---

## FILES TO OPEN (IN THIS ORDER):

1. Homepage: http://localhost:3000
2. **types/flight.ts** - Type definitions
3. **app/api/flights/route.ts** - API endpoint
4. **store/flightStore.ts** - State management
5. **components/search/SearchForm.tsx** - Search form logic
6. **components/results/FlightList.tsx** - Results display
7. **components/charts/PriceTrendChart.tsx** - Price chart
8. **app/page.tsx** - Main homepage (show UI)

---

## PRO TIPS FOR RECORDING:

- Have `.env.local` ready (don't show API keys on screen!)
- Have `npm run dev` running before you start recording
- Open all files in tabs before recording - don't spend time searching
- Speak clearly and not too fast - people need time to read code
- Use keyboard shortcuts: `Ctrl+P` to open files, `Ctrl+/` to toggle comments
- Zoom in VS Code (Ctrl+Scroll) so code is readable
- Pause between sections if needed - Loom lets you edit later
- Don't scroll too fast through code - let viewers follow
