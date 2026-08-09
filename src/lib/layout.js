/**
 * One container, used by every section.
 *
 * Sections previously each picked their own width — Hero and Growth at
 * `max-w-6xl`, Work at `max-w-screen-xl`, Contact at `max-w-4xl`. The left
 * edge of the content therefore jumped three times on the way down the page,
 * which is exactly the kind of misalignment you feel without being able to
 * name it.
 *
 * `SECTION` is the outer <section> wrapper: rhythm, horizontal padding and the
 * shared max width. Use it for every top-level section.
 *
 * `PROSE` caps line length for body copy. Readable measure is roughly 65-75
 * characters; the container is much wider than that because it also holds
 * grids, so paragraphs need their own limit.
 */

/**
 * Shared max width — 92rem (1472px).
 *
 * Was 72rem, which left roughly 700px of dead space on either side of a
 * 2560px display and made the whole page feel like a narrow column floating
 * in the middle. Body copy stays readable because `PROSE` caps paragraph
 * measure independently; only grids and layout actually use the full width.
 */
export const CONTAINER = "max-w-[92rem]"

/** Standard top-level section: vertical rhythm + gutter + shared width. */
export const SECTION = `py-24 px-6 md:px-10 ${CONTAINER} mx-auto`

/** Body copy measure. */
export const PROSE = "max-w-2xl leading-relaxed"

/** Section eyebrow label — small caps above every heading. */
export const EYEBROW = "text-blue-400 text-xs tracking-[0.18em] uppercase mb-3"

/** Section heading. */
export const HEADING = "text-4xl font-bold text-white"
