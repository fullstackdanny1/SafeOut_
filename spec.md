SafeOut — Technical & Functional Specification Sheet 
  Document Version: 1.0
  Target Platform: Web / PWA (Mobile-first victim UI, Desktop dispatcher & admin
  portals)
  Core Purpose: Instant, friction-free emergency assistance and anti-human trafficking
  intervention platform.
  ──────
  ## 1. System Overview & Mission

  SafeOut is a privacy-first, zero-install emergency response web platform designed to
  assist individuals in distress (such as nightlife harassment, potential human
  trafficking scenarios, or acute personal emergencies).

  ### Core Pillars
  1. Zero-Friction Access: No registration, native app download, or account creation
  required for victims. Scanning a physical QR code (placed in restrooms, venues,
  transit hubs) or accessing the URL immediately connects the user to response
  workflows.
  2. Context-Aware Geolocation: Blends physical QR code metadata (fixed venue name,
  room/placement, city coordinates) with browser-based live GPS tracking.
  3. Data Minimization & GDPR Compliance: Sensitive victim data is encrypted in transit
  and at rest. Contacts and location pings are handled anonymously or tied only to
  temporary capability tokens.
  4. Multi-Tenant City Isolation: Multi-city dispatch architecture isolated via
  PostgreSQL Row-Level Security (RLS). Dispatchers can only observe and manage
  incidents within their assigned operational jurisdiction.
  ──────
  ## 2. Target Users & System Roles
   Role                      │ Interface		  │ Description & Access Scope
  ───────────────────────────┼────────────────────────────┼────────────────────────────
   End User / Victim         │ PWA (/ & /pwa)		  │ Anonymous public user. Can
                             │                            │ trigger emergencies (112,
                             │                            │ 119), request an escort
                             │                            │ ("Get me out"), locate
                             │                            │ nearby safe havens, or
                             │                            │ ping trusted contacts.
   Trusted Contact           │ Live Tracker (/track)      │ Third party receiving an
                             │                            │ emergency share link
                             │                            │ (share_token). Can view
                             │                            │ live updates of the
                             │                            │ victim's location on an
                             │                            │ interactive map.
   City Dispatcher           │ Dispatcher Portal          │ Local response operators
                             │ (/dispatcher)		  │ (NGOs, venue security, or
                             │                            │ dispatch center). Monitors
                             │                            │ incoming incidents in
                             │                            │ real-time, acknowledges,
                             │                            │ and marks them resolved
                             │                            │ for their designated city.
   Super Admin / Regional    │ PowerAdmin (/poweradmin)   │ Global administrators.
   Lead                      │                            │ Manages venues, physical
                             │                            │ QR codes, dispatcher user
                             │                            │ accounts, audit logs, and
                             │                            │ evidence records across
                             │                            │ all cities.
  ──────
  ## 3. Core Functional Capabilities
  ### 3.1. Victim / Public PWA Interface (frontend/pwa/)

  • Multi-Language Support (i18n): Native support for Romanian (ro), English (en), and
  German (de) with instantaneous switching.
  • Instant Emergency Dialing:
      • 112 (National Emergency Line): One-tap dialer for Police / Ambulance / Fire.
      Concurrently registers an incident with GPS location and QR placement.
      • 119 (National Child Helpline): Confidential 24/7 hotline for minors in danger
      or abuse.
  • "Get Me Out" (Escort & Safe Haven Navigation):
      • Queries OpenStreetMap / Overpass API and local registries for the closest
      emergency safe zones: Police Stations, Gendarmerie, Hospitals / Emergency Rooms,
      and 24h Pharmacies.
      • Displays distance and opens turn-by-turn navigation in Google Maps / Apple Maps.
      • Submits an escort incident to the local dispatcher network.
  • "Call Somebody" (Trusted Contact Ping):
      • Allows a user to notify a personal contact with a single tap.
      • Generates a unique, capability-based live tracking link
      (/track?t={share_token}) and registers an anonymous ping in the system.
  • Live Background Location Beaconing:
      • When an alert is active, the PWA streams periodic GPS updates to
      /incidents/:id/location using a secret update_token.
  • Evidence Collection:
      • Upload capability for situational photos or audio notes stored securely against
      an incident record.


  ### 3.2. Trusted Contact Tracker (frontend/track/)
  • Access-controlled solely via high-entropy UUID capability token (share_token).
  • Leaflet map visualizes the victim’s real-time position with accuracy radius rings.
  • Displays status indicators: Live streaming, Stale (if updates stop > 60s), or
  Resolved.
  ### 3.3. Dispatch Center (frontend/dispatcher/)
  • Live Incident Dashboard:
      • Auto-refreshing list of incoming incidents filtered by city via Row-Level
      Security.
      • Audible alerts (synthesized Web Audio beeps) upon arrival of new critical
      incidents.
      • Stat counters: Active incidents, In-progress / Acknowledged, Total tonight, and
      Anonymous contact pings.
  • Incident Lifecycle Management:
      • Transitions: pending → acknowledged → resolved.
      • Dispatchers can append internal operational notes and track dispatched actions.
  • Interactive City Map:
      • Leaflet map plotting active incidents and their precise coordinates.
  • Audit Trail:
      • Real-time session activity logging recording dispatcher actions for
      accountability.
  ### 3.4. PowerAdmin Management Portal (frontend/poweradmin/)
  • Access Control: URL parameter gatekeeper (sinca-2026-safeout) combined with
  SuperAdmin JWT verification.
  • Venue & Placement Registry:
      • Add, edit, geolocate, and deactivate partner venues (clubs, bars, festivals,
      stations).
  • QR Code Lifecycle:
      • Generate and link physical QR codes to specific venues and placements (e.g.,
      "Restroom Stall #3").
      • Scan counter tracking to detect high-risk locations.
  • Dispatcher Account Provisioning:
      • Create, modify, and revoke regional dispatcher credentials with city scoping.
  • Evidence & Legal Holds:
      • Inspection of uploaded photos and audio files with legal hold toggles
      preventing auto-expiry.
  ──────
  ## 4. Technical Architecture & Technology Stack
    [ PWA / Mobile Browser ]   [ Dispatcher Dashboard ]   [ PowerAdmin Portal ]   [
    Public Tracking View ]
             |                            |                         |
                                    |
             +----------------------------+------------+------------+------------------
             ------+
                                                       |  REST APIs / JSON over HTTPS
                                                       v
                                     +----------------------------------+
                                     |         Node.js / Express        |
                                     |  - Rate Limiters (Public, Auth)  |
                                     |  - JWT Authentication Middleware |
                                     |  - Role & Capability Guards      |
                                     +----------------------------------+
  		                                       |
                                                       v
  				     +----------------------------------+
                                     |      PostgreSQL Database         |
  			             |  - Native Row-Level Security     |
                                     |  - Scoped Context Transactions   |
                                     |  - Indices on City & Status      |
  		                     +----------------------------------+

  • Backend Engine: Node.js, Express (persistent VPS/container deployment).
  • Database & Security: PostgreSQL with node-pg-migrate and native Row-Level Security
  (RLS) using SET LOCAL app.current_city / SET LOCAL app.current_role.
  • Authentication: Custom JWT-based session management with bcryptjs password hashing;
  no reliance on third-party auth vendors.
  • Mapping & Geolocation: Leaflet.js, OpenStreetMap tiles, and Overpass API.
  • Traffic Protection: Dual-tier rate limiting via express-rate-limit (strict 15/15m
  limit on authentication, elevated 400/15m on GPS beaconing).
  ──────
  ## 5. Database Schema & Data Model
   Table         │ Purpose                          │ Key Attributes
  ───────────────┼──────────────────────────────────┼──────────────────────────────────
   dispatchers   │ User accounts for operators and  │ id, email, password_hash,
                 │ admins                           │ full_name, role (dispatcher |
		 │                                  │ super_admin), city, created_at
   venues        │ Partner establishments           │ id, name, type, city, latitude,
		 │                                  │ longitude, active, created_at
   qrcodes       │ Physical QR sticker mappings     │ id, code (unique), venue_id,
		 │                                  │ venue_name, placement, city,
		 │                                  │ latitude, longitude, scans,
		 │                                  │ active
   incidents     │ Core emergency records           │ id, situation_type (emergency |
		 │                                  │ escort | contact), status
		 │                                  │ (pending | acknowledged |
		 │                                  │ resolved), city, qr_code_id,
		 │                                  │ latitude, longitude,
		 │                                  │ location_accuracy_m,
		 │                                  │ location_method, live_tracking,
		 │                                  │ update_token, share_token,
		 │                                  │ notes, dispatcher_id, timestamps
   evidence      │ Audio notes and incident photos  │ id, incident_id, file_type
		 │                                  │ (photo | audio), storage_url,
		 │                                  │ legal_hold, uploaded_at,
		 │                                  │ expires_at
   contact_pings │ Anonymous usage metrics for      │ id, created_at
		 │ "Call somebody"                  │
   audit_log     │ Security and operational trace   │ id, dispatcher_id, action,
		 │                                  │ detail, created_at
  ──────
  ## 6. Security, Privacy & Data Protection

  1. Row-Level Security (RLS):
      • Normal dispatchers are constrained by Postgres RLS: SELECT, UPDATE queries
      strictly evaluate city = CURRENT_SETTING('app.current_city').
      • Only authenticated super_admin accounts can bypass regional boundaries.
  2. Capability Token Isolation:
      • Victims update their live location without an account using a private
      update_token.
      • Friends track live location using an independent share_token which exposes
      solely GPS and status attributes, omitting dispatcher notes or evidence files.
  3. Audit Trail & Non-Repudiation:
      • Critical operator interactions (status acknowledgments, resolution, profile
      changes) log timestamps and dispatcher identities into audit_log.
