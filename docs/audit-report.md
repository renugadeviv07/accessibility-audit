# Accessibility Audit Report: India Post (https://www.indiapost.gov.in/)



## 1. Audit summary

| Item | Value |
|---|---|
| Reference site | https://www.indiapost.gov.in/ (home page) |
| Date audited | 13 November 2026 |
| Lighthouse accessibility score | **100 / 100** (run 15:26:53 in Chrome DevTools; 34 audits passed, 27 not applicable, 0 failed). Device mode (mobile/desktop) was not recorded in the screenshots. |
| Tools used | Chrome DevTools Lighthouse; review of page content/links |
| Evidence | `docs/screenshots/lighthouse-score-100.png`, `lighthouse-passed-audits.png`, `lighthouse-not-applicable-1.png`, `lighthouse-not-applicable-2.png` |
| Auditor |Renugadevi |

**Reading of the result.** The site scores 100 and shows a GIGW 3.0 Accessibility Certificate in its footer, and it provides a "Skip to main content" link and a Government of India / Digital India header, so the automated baseline is strong. Lighthouse checks only a subset of WCAG, so the issues below are things an automated score does not measure: link purpose, widget semantics and moving or repeated content.

## 2. Method
1. Lighthouse (Accessibility category) in Chrome DevTools.
2. Review of the home page content and link text against WCAG 2.2 (2.4.4 Link Purpose, 4.1.2 Name/Role/Value, 2.2.2 Pause/Stop/Hide, 2.5.3 Label in Name).
3. Not done in this report: screen-reader testing (NVDA/VoiceOver), full keyboard walkthrough, colour-contrast measurement. These are marked *unverified*.

## 3. Checklist

| # | Area | WCAG | Method | Result |
|---|---|---|---|---|
| 1 | Automated checks (names, ARIA, alt, contrast, labels) | various | Lighthouse | Pass (100) |
| 2 | Skip link | 2.4.1 | Page content | Present |
| 3 | Link purpose | 2.4.4 | Page content | Issues 1, 2 |
| 4 | Menu semantics | 4.1.2 | Page content | Issue 3 |
| 5 | Moving / repeated content | 2.2.2 | Page content | Issue 4 |
| 6 | Accessible names | 2.5.3 | Page content | Issue 5 |
| 7 | Keyboard operation, focus visibility | 2.1.1, 2.4.7 | Manual | _unverified_ |
| 8 | CAPTCHA on the tracking form ("Initializing CAPTCHA...") | 3.3.8 | Manual | _unverified_ (check a non-visual alternative exists) |
| 9 | Captions for the embedded video | 1.2.2 | Manual | _unverified_ |

## 4. The five issues

| # | Title | Severity | WCAG |
|---|---|---|---|
| 1 | Header contact link text is a raw URL path | Medium | 2.4.4, 2.5.3 |
| 2 | Non-descriptive link text "Click" for the app download | Low | 2.4.4 |
| 3 | Main-menu triggers are placeholder `#` links | Medium | 4.1.2 |
| 4 | Announcement text is duplicated and likely auto-scrolling | Medium | 2.2.2, 1.3.1 |
| 5 | Repeated words in navigation link names | Low | 2.5.3, 2.4.4 |

### Issue 1: Header contact link text is a raw URL path
- **Description:** In the top header the link to Contact Us displays and exposes the text `/help&Support/contactus` instead of a readable label. A `title="Contact Us"` exists, but title is not a reliable accessible name.
- **Evidence:** Page content shows the link text as `/help&Support/contactus`. *Confirm:* Inspect the link in the header; screenshot to `docs/screenshots/issue-1-contact-link.png`.
- **Impact:** Screen-reader users hear a URL fragment; voice-control users cannot say "click Contact Us"; low-vision and cognitive users get no clear label.
- **Severity:** Medium: the link is on every page and is a main help route.
- **Recommended solution:** Use visible text that names the destination.
- **Technical example:**
  ```html
  <!-- before (as extracted) -->
  <a href="/help&Support/contactus" title="Contact Us">/help&Support/contactus</a>
  <!-- after -->
  <a href="/help&Support/contactus">Contact Us</a>
  ```
- **How this project addresses it:** every link has a readable label (`client/src/components/Header.jsx`, `Footer.jsx`).

### Issue 2: Non-descriptive link text "Click" for the app download
- **Description:** In the Dak Sewa App section the Play Store link text is just "Click (opens in a new tab)". A similar link elsewhere begins "Click here to contact us...".
- **Evidence:** Page content: `[Click (opens in a new tab)](https://play.google.com/store/apps/details?id=info.indiapost.daksewa)`. *Confirm:* screenshot to `docs/screenshots/issue-2-click-link.png`.
- **Impact:** Screen-reader users who list links hear many entries that say only "Click"; the purpose is unclear out of context.
- **Severity:** Low: the surrounding sentence helps sighted users.
- **Recommended solution:** Put the purpose in the link text.
- **Technical example:**
  ```html
  <!-- before -->
  <a href="https://play.google.com/store/apps/details?id=info.indiapost.daksewa" target="_blank">Click</a>
  <!-- after -->
  <a href="https://play.google.com/store/apps/details?id=info.indiapost.daksewa" target="_blank">Download the Dak Sewa app on Google Play (opens in a new tab)</a>
  ```
- **How this project addresses it:** link text states the action, e.g. the "Give feedback" button in `HomePage.jsx`.

### Issue 3: Main-menu triggers are placeholder `#` links
- **Description:** The top-level menu items Ministry, Offerings, Documents, Media and Connect have `href="#"` and open sub-menus. A link that does not navigate is announced as a link, but behaves as a button.
- **Evidence:** Page content shows `[Ministry](#)`, `[Offerings](#)`, `[Documents](#)`, `[Media](#)`, `[Connect](#)`. Whether `aria-expanded` is present is *unverified*. *Confirm:* Inspect "Ministry" and check for `aria-expanded`; screenshot to `docs/screenshots/issue-3-menu-triggers.png`.
- **Impact:** Screen-reader users are not told a menu is collapsed or expanded; Space does not activate a link, so keyboard users may have trouble; a click can jump the page to the top.
- **Severity:** Medium: it is the main navigation.
- **Recommended solution:** Use real buttons with `aria-expanded` and `aria-controls`.
- **Technical example:**
  ```html
  <!-- before -->
  <a href="#">Ministry</a>
  <!-- after -->
  <button type="button" aria-expanded="false" aria-controls="menu-ministry">Ministry</button>
  <ul id="menu-ministry" hidden> ... </ul>
  ```
- **How this project addresses it:** navigation uses real in-page links to real sections (`Header.jsx`, `<nav aria-label="Primary">`); it has no hidden sub-menus.

### Issue 4: Announcement text is duplicated and likely auto-scrolling
- **Description:** The "Fraud Alert" announcement and its "Click here to contact us..." link appear twice in a row in the page content. This pattern usually comes from a scrolling ticker that clones its content. The home banner also has seven numbered slides.
- **Evidence:** The same alert paragraph appears twice back to back in the extracted page. Whether it moves, and whether a pause control exists, is *unverified*. *Confirm:* watch the announcement bar, look for a pause button, and screenshot to `docs/screenshots/issue-4-announcement.png`.
- **Impact:** Screen-reader users hear the alert twice; moving text is hard to read for people with low vision, dyslexia or attention difficulties; WCAG 2.2.2 requires a way to pause, stop or hide anything that moves for more than 5 seconds.
- **Severity:** Medium: it carries a safety (fraud) message.
- **Recommended solution:** Render the text once, hide any clone with `aria-hidden="true"`, add a visible pause control, and stop motion under `prefers-reduced-motion`.
- **Technical example:**
  ```html
  <!-- before (as extracted): same <p> rendered twice -->
  <!-- after -->
  <div class="ticker"><p>Fraud Alert: ...</p><p aria-hidden="true">Fraud Alert: ...</p></div>
  <button type="button" aria-pressed="false">Pause announcements</button>
  ```
- **How this project addresses it:** static content, and `prefers-reduced-motion` support in `client/src/styles/main.css`.

### Issue 5: Repeated words in navigation link names
- **Description:** Each sub-menu link name is the label repeated, for example "About UsAbout Us", "Mail ProductsMail Products", "Saving SchemesSaving Schemes".
- **Evidence:** The extracted link text repeats for every sub-menu item. Whether the second copy is visually hidden text or a rendering artefact is *unverified*. *Confirm:* Inspect "About Us", open the DevTools **Accessibility** pane, read the computed **Name**; screenshot to `docs/screenshots/issue-5-duplicate-names.png`.
- **Impact:** If both copies are exposed, screen readers read every item twice, making long menus slower to scan.
- **Severity:** Low (pending confirmation).
- **Recommended solution:** Expose the label once; hide any visual duplicate with `aria-hidden="true"`.
- **Technical example:**
  ```html
  <!-- before -->
  <a href="/ministry/aboutus"><span>About Us</span><span>About Us</span></a>
  <!-- after -->
  <a href="/ministry/aboutus"><span>About Us</span><span aria-hidden="true">About Us</span></a>
  ```
- **How this project addresses it:** each nav item contains its label once (`Header.jsx`).

## 5. Where this portal applies the usual fixes

| Category | Implementation |
|---|---|
| Skip link, landmarks | `SkipLink.jsx`, `Header.jsx`, `Footer.jsx`, `App.jsx` |
| Heading hierarchy | One `h1` in `HomePage.jsx`; each section an `h2` |
| Form labels, errors, hints | `FormField.jsx` (`label[for]`, `aria-describedby`, `aria-invalid`) |
| Error summary with focus | `FeedbackForm.jsx` |
| Status announcements | `StatusMessage.jsx` |
| Focus indicators, target size, reduced motion | `client/src/styles/main.css` |

## 6. Test status of this portal
See `docs/testing.md`: server tests 12/12 and client tests 7/7 passed. Lighthouse has **not** been run against the portal yet: **Not measured**. Run `npm start` then `npm run audit:app` and record the real score here.
