# Reference behaviour

Observed by driving the live page in a browser. Its JavaScript is minified past reading, so everything
here was watched rather than read out of the source. Measurements in px, timings in ms.

Where the clone differs on purpose it's marked. Everything unmarked matches.

## Listing page
| Interaction | Reference behaviour | Clone |
|---|---|---|
| Sticky section nav | Slides in (translateY -100% → 0, opacity, 250ms ease) once the hero grid's bottom edge ≤ 0. Contains links + price + Reserve; the price block is always shown. Active link = last section whose top ≤ ~100px. | Same (`useScrollSpy`, offset 100) |
| Nav links | `href="#…"` but inert (no scroll, no hash change). | **Deviation:** smooth-scroll to the section, offset by the 66px bar. |
| Save | Toggles outline → filled heart (`color: --rausch`), label "Save"/"Saved", toast "Saved to wishlist" / "Removed from wishlist". Not persisted. | Same, plus localStorage persistence and `aria-pressed`. |
| Share | Toast "Share options". | Same |
| Reserve (card + nav) | Toast "You won't be charged yet". | Same |
| Toast | Fixed bottom 32px, fades/slides 200ms, visible ~2.5s. | 2500ms |
| Description "Show more" | Removes clamp (6.2em, gradient mask), label → "Show less". | Same |
| Review "Show more" | Removes 4-line clamp, label → "Show less". Only on reviews long enough to clamp. | Same (threshold 180 chars) |
| "Show all 50 amenities" | Opens dialog (backdrop `#00000080`, fade 200ms; panel 780px slides 20px → 0, 250ms cubic-bezier(.2,0,0,1)). Body `overflow:hidden`. Esc closes. Focus is **not** moved into the dialog and there is no focus trap. | **Deviation (a11y):** focus moves to Close, Tab is trapped, focus restored on close; backdrop click closes. |
| "More stays nearby" arrows | Scroll the track by one page (smooth), counter "n / 2", disabled at ends. | Same |
| Calendar, header, Claim, chips, map, Message host, Learn more, Report | Static / no-op. | Static |
| Focus ring | Only after keyboard use (`body.kbd`): 2px #222 outline, offset 2px (3px on photo tiles). | Same |

## Photo Tour
| Interaction | Reference | Clone |
|---|---|---|
| Open | "Show all photos" or any hero tile. Overlay: opacity 0→1, translateY 28px→0, 300ms cubic-bezier(.2,0,0,1). `pushState` → `?modal=PHOTO_TOUR_SCROLLABLE`. Body scroll locked. | Same |
| Hero tile → position | Tour scroll area positioned so the photo's *room section* top sits 24px below the bar (section top at y=112 with an 88px bar). | Same (`ROOM_OFFSET = 24`) |
| Show all photos → position | Keeps whatever scroll position the tour last had. | **Deviation:** opens at the top. |
| Room thumbnails | Smooth-scroll to the room section (same 24px offset). | Same |
| Back button / Esc / browser Back | Close (history.back). Focus not restored. | Same, focus restored to opener. Focus moves to Back on open. |
| Share / Save in the bar | Inert. | **Deviation:** mirror the page's Share/Save. |
| Hover | Thumbnails scale 1.04 + brightness .94 (250ms); photos scale 1.04 (400ms) + 8% dark overlay. | Same |

## Lightbox
| Interaction | Reference | Clone |
|---|---|---|
| Open | Any tour photo. Fade 250ms ease. `pushState` → `…&modalItem=1000+index`. Title = room name, counter "n of 43". | Same, focus moves to Close. |
| ←/→, prev/next buttons | Change photo instantly (no image transition; the `lbFade` keyframes the CSS references are never defined). `replaceState` updates `modalItem`. Buttons disabled at the ends — no wrap-around. Home/End do nothing. | Same, counter is `aria-live`, neighbours preloaded. |
| Close / grid button / Esc / browser Back | Close the lightbox only; the tour stays where it was. | Same, focus restored to the photo that opened it. **Deviation (a11y):** the grid button is labelled "Back to photo tour" instead of "Show all photos", so it doesn't share an accessible name with the hero button. |
| Click on the white background | Does nothing. | Same |
| Deep link `?modal=…&modalItem=N` | Opens straight into that photo. | Same, plus the index is validated — an out-of-range or non-integer `modalItem` falls back to the tour instead of a blank frame. |

## Contrast

The palette comes from the reference, so these ratios are inherited rather than chosen. All clear WCAG
1.4.3 (4.5:1), but two only just — worth knowing before touching a colour:

| Pair | Ratio |
|---|---|
| `--muted2` `#717171` on `#fff` | 4.88:1 |
| `--muted` `#6a6a6a` on `#fff` | 5.41:1 |
| `--muted2` on `--grey100` `#f7f7f7` (booking card's cancellation note) | 4.56:1 |
| `#fff` on the Reserve gradient's lightest stop `#e61e4d` | 4.51:1 |
