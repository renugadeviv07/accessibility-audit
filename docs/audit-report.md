# Accessibility Audit Report: India Post (https://www.indiapost.gov.in/)

> **STATUS: AUDIT NOT YET PERFORMED.**
> This report was prepared in an environment with **no internet access and no browser access to the reference site**.
> Nothing in it is a measured result. There is **no Lighthouse score, no screenshot and no confirmed finding** yet.
> The five issues below are **candidate focus areas to confirm or reject** by following the procedure in this document on your own machine.
> Replace every `TO BE FILLED` marker with real evidence. If a candidate does not reproduce on the live site, replace it with a genuine finding from your audit.
> The original website must not be modified. Only observe and record.

## 1. Audit summary (fill in after testing)

| Item | Value |
| --- | --- |
| Reference site | https://www.indiapost.gov.in/ |
| Date and time of audit | TO BE FILLED |
| Browser and version | TO BE FILLED |
| Lighthouse version | TO BE FILLED |
| Lighthouse accessibility score, desktop | **Not measured** |
| Lighthouse accessibility score, mobile | **Not measured** |
| Lighthouse report files | `docs/lighthouse/indiapost.report.html` / `.json` (created by `npm run lighthouse:indiapost`; not yet generated) |
| Keyboard-only test completed | No |
| Screenshots captured | None (`docs/screenshots/` is empty) |
| Screen reader used | None |

Automated tools such as Lighthouse (axe-core) detect only a portion of WCAG issues. A high score does not prove accessibility, and a low score does not describe every barrier. Record both automated results and manual observations.

## 2. Procedure

Do all steps in a clean Chrome profile or an Incognito window (extensions can change results). Record the date, because the live site changes over time.

### 2.1 Lighthouse (two options)

**Option A: Chrome DevTools**

1. Open https://www.indiapost.gov.in/ in Chrome and wait for the page to finish loading.
2. Press `F12`, open the **Lighthouse** panel.
3. Mode: **Navigation**. Device: **Desktop** (repeat later with **Mobile**). Categories: tick only **Accessibility**.
4. Click **Analyze page load**. Note the score and every failed audit.
5. Use the three-dot menu in the report to **Save as HTML** and **Save as JSON** into `docs/lighthouse/`.

**Option B: command line (PowerShell)** from the repository root, with Chrome installed:

```powershell
npm run lighthouse:indiapost
```

This writes `docs/lighthouse/indiapost.report.html` and `indiapost.report.json`. Add `--preset=desktop` or `--form-factor=mobile` by running `npx --yes lighthouse@12` directly if you need to control the device. Lighthouse emulates mobile by default.

### 2.2 Keyboard-only navigation

Unplug or ignore the mouse. Starting at the top of the page, use `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys and `Esc`. Record answers:

- Is there a "Skip to main content" link as the first focus stop? (WCAG 2.4.1)
- Does the focus order follow the visual order? (2.4.3)
- Is the focus indicator always visible and not clipped or hidden? (2.4.7, 2.4.11)
- Can every menu, dropdown, carousel, search box and language/font-size control be opened, used and closed with the keyboard? (2.1.1)
- Can you get trapped anywhere? (2.1.2)

### 2.3 Console snippets (paste into the DevTools Console)

```js
// Images without an alt attribute, and images with empty alt that are inside links
[...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src);
[...document.querySelectorAll('a img[alt=""]')].map(i => i.closest('a').href);

// Heading outline
[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => `${h.tagName} ${h.textContent.trim().slice(0, 60)}`);

// Form controls with no accessible name (no label, aria-label or aria-labelledby)
[...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')]
  .filter(el => !el.labels?.length && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
  .map(el => el.outerHTML.slice(0, 120));

// Landmarks present
[...document.querySelectorAll('header,nav,main,footer,aside,[role=banner],[role=navigation],[role=main],[role=contentinfo]')]
  .map(el => el.tagName + (el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''));

// Page language
document.documentElement.lang;
```

### 2.4 Colour contrast

Right-click an element, choose **Inspect**, click the colour swatch next to `color` in the **Styles** pane. DevTools shows the contrast ratio and whether it passes AA (4.5:1 for normal text, 3:1 for large text and for UI component boundaries). Also review the Lighthouse "Background and foreground colors do not have a sufficient contrast ratio" audit if it appears.

### 2.5 Screenshots

For each confirmed finding capture a screenshot (`Win + Shift + S`, or DevTools: `Ctrl+Shift+P` > "Capture node screenshot"). Save as `docs/screenshots/issue-N-short-name.png` and reference it in the issue below. Do not commit screenshots that show personal data.

## 3. The five issues (candidates to confirm)

Severity scale used: **Critical** (blocks a task entirely for some users), **High** (serious barrier, workaround is hard), **Medium** (causes difficulty or confusion), **Low** (minor or best-practice).

Each issue has a *fix pattern*. The fix patterns are generic and valid regardless of what the audit finds. The *evidence*, *severity* and *impact* fields depend on what you actually observe.

### Findings table (fill in)

| # | Focus area | Confirmed on live site? | Lighthouse audit / WCAG criterion | Severity |
| --- | --- | --- | --- | --- |
| 1 | Image alternative text | TO BE FILLED | "Image elements do not have `[alt]` attributes" / 1.1.1 | TO BE FILLED |
| 2 | Colour contrast | TO BE FILLED | "Background and foreground colors do not have a sufficient contrast ratio" / 1.4.3, 1.4.11 | TO BE FILLED |
| 3 | Keyboard access and visible focus | TO BE FILLED | Manual test / 2.1.1, 2.4.1, 2.4.7, 2.4.11 | TO BE FILLED |
| 4 | Form labels and accessible names | TO BE FILLED | "Form elements do not have associated labels", "Links do not have a discernible name" / 1.3.1, 3.3.2, 4.1.2 | TO BE FILLED |
| 5 | Heading hierarchy, landmarks and semantic HTML | TO BE FILLED | "Heading elements are not in a sequentially-descending order", "Document does not have a main landmark" / 1.3.1, 2.4.6 | TO BE FILLED |

If an area passes, substitute another real issue (for example an architecture issue such as heavy render-blocking resources, non-semantic markup for layout, or a navigation menu that works only on hover).

---

### Issue 1: Image alternative text (candidate)

- **Status:** TO BE CONFIRMED. Not verified.
- **Description:** Informative images, logos and linked images need a text alternative; decorative images need an empty `alt=""`.
- **Actual evidence:** TO BE FILLED (page URL, the `src` of each offending image from the console snippet, Lighthouse audit text).
- **Screenshot / Lighthouse reference:** TO BE FILLED (`docs/screenshots/issue-1-...png`, Lighthouse report section).
- **Impact on users:** Screen-reader users hear a file name or nothing; linked images without a name make links unusable.
- **Severity:** TO BE FILLED.
- **Recommended solution:** Give every informative image a concise `alt`; use `alt=""` for purely decorative images; give linked images a name that describes the destination.
- **Technical implementation example:**

```html
<!-- Informative image -->
<img src="/img/speed-post.jpg" alt="A postal worker handing a parcel to a customer at a counter" />
<!-- Decorative image -->
<img src="/img/divider.png" alt="" />
<!-- Image inside a link: the link needs a name -->
<a href="/track"><img src="/img/track.png" alt="Track your parcel" /></a>
```

### Issue 2: Colour contrast (candidate)

- **Status:** TO BE CONFIRMED. Not verified.
- **Description:** Text and UI component boundaries must have enough contrast against their background.
- **Actual evidence:** TO BE FILLED (element selector, foreground and background colours, measured ratio from DevTools).
- **Screenshot / Lighthouse reference:** TO BE FILLED.
- **Impact on users:** People with low vision or colour-vision deficiency, and anyone reading in bright light, may not be able to read the content.
- **Severity:** TO BE FILLED.
- **Recommended solution:** Meet 4.5:1 for normal text, 3:1 for large text and UI boundaries; store colours as design tokens and test them automatically.
- **Technical implementation example:** the portal in this repository keeps all colours in CSS custom properties and checks them with a script:

```css
:root { --muted: #475569; --surface: #ffffff; } /* 7.58:1 */
.hint { color: var(--muted); }
```
```powershell
npm run contrast
```

### Issue 3: Keyboard access and visible focus (candidate)

- **Status:** TO BE CONFIRMED. Not verified.
- **Description:** All functionality must work from the keyboard, with a logical order, a skip link and a visible focus indicator.
- **Actual evidence:** TO BE FILLED (the exact control, the keys pressed, what happened; short screen recording or screenshot of missing focus).
- **Screenshot / Lighthouse reference:** TO BE FILLED. This is largely a manual finding; Lighthouse covers only parts (for example `tabindex` values greater than 0, "bypass blocks").
- **Impact on users:** Keyboard and switch-device users, and many screen-reader users, cannot reach or operate controls, or lose track of where they are.
- **Severity:** TO BE FILLED (usually High or Critical if a menu cannot be opened by keyboard).
- **Recommended solution:** Use native `<a>` and `<button>`, add a skip link, never remove outlines without a replacement, make menus work with `Enter`, `Space` and `Esc`.
- **Technical implementation example:**

```html
<a class="skip-link" href="#main">Skip to main content</a>
<main id="main" tabindex="-1">...</main>
```
```css
:focus-visible { outline: 3px solid #0b2545; outline-offset: 3px; }
```

### Issue 4: Form labels and accessible names (candidate)

- **Status:** TO BE CONFIRMED. Not verified.
- **Description:** Every input, select, textarea, icon button and link needs a programmatic name; errors must be tied to their fields.
- **Actual evidence:** TO BE FILLED (the search box, tracking form, language selector or other controls found by the console snippet).
- **Screenshot / Lighthouse reference:** TO BE FILLED.
- **Impact on users:** Screen-reader and voice-control users cannot identify the control or say its name; placeholder-only labels disappear when typing.
- **Severity:** TO BE FILLED.
- **Recommended solution:** Use a visible `<label for>` for each field, add `aria-label` only for icon-only controls, link hints and errors with `aria-describedby`.
- **Technical implementation example:**

```html
<label for="trackId">Consignment number</label>
<input id="trackId" name="trackId" autocomplete="off" aria-describedby="trackId-hint" />
<p id="trackId-hint">13 characters, for example EE123456789IN</p>
<button type="submit">Track</button>
```

### Issue 5: Heading hierarchy, landmarks and semantic HTML (candidate)

- **Status:** TO BE CONFIRMED. Not verified.
- **Description:** Pages should have one `h1`, headings that do not skip levels, and landmarks (`header`, `nav`, `main`, `footer`) so assistive technology users can navigate by structure.
- **Actual evidence:** TO BE FILLED (heading outline output, list of landmarks, whether menus are built from `<ul>` or from `<div>`s).
- **Screenshot / Lighthouse reference:** TO BE FILLED.
- **Impact on users:** Screen-reader users navigate by headings and landmarks; a broken outline makes the page slow and confusing to understand.
- **Severity:** TO BE FILLED.
- **Recommended solution:** Mark up structure with semantic elements and keep a logical heading order; label multiple `nav` regions.
- **Technical implementation example:**

```html
<header>...<nav aria-label="Primary"><ul><li><a href="/">Home</a></li></ul></nav></header>
<main id="main"><h1>Page title</h1><section aria-labelledby="s1"><h2 id="s1">Section</h2></section></main>
<footer><nav aria-label="Footer">...</nav></footer>
```

---

## 4. How the new portal addresses each area

These are **design intentions implemented in source code**. None has been confirmed by Lighthouse, a browser or a screen reader yet.

| Area | Implementation in this repository | Verified how |
| --- | --- | --- |
| Alternative text | Hero illustration is `role="img"` with a descriptive `<title>`; the logo is decorative (`aria-hidden`) beside visible text | Unit test (jsdom). Not verified with a screen reader |
| Colour contrast | Tokens in `client/src/styles/global.css`; 23 pairs checked by `npm run contrast` | Arithmetic check (all pairs passed when run). Not verified in a browser |
| Keyboard and focus | Skip link, `:focus-visible` rings, 44px targets, Escape closes the menu | Unit tests (jsdom). Real keyboard pass still needed |
| Labels and names | Native `<label>` per field, `aria-describedby` for hints and errors, `autocomplete` tokens | Unit tests (jsdom). Not verified with a screen reader |
| Headings and semantics | One `h1`, no skipped levels, landmarks, labelled `nav` regions | Unit tests (jsdom). Lighthouse not run |

## 5. Limitations of this report

- No network, browser or screen-reader testing was possible when the report was prepared.
- No claim of WCAG 2.2 AA conformance is made for the portal or for the reference site.
