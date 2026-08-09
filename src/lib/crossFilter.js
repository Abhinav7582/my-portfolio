import { projects } from "../Data/projects"

/**
 * Cross-section filtering.
 *
 * The link that turns four sections into one system: selecting something in
 * Growth narrows Work to the matching projects and jumps you there.
 *
 * Two kinds:
 *   period — the projects built during one career stage (explicit `projectIds`,
 *            because three separate roles all sit at Affine Analytics and the
 *            company name can't disambiguate them)
 *   tag    — every project using one tool from the toolkit cloud
 *
 * Kept as plain data + pure functions so it can be unit-tested headlessly,
 * like the background maths.
 */

/** Filter for the projects built during one career stage. */
export function periodFilter(stage) {
  const ids = stage.growth?.projectIds ?? []
  return {
    kind: "period",
    key: `period-${stage.id}`,
    label: `${stage.growth?.year} · ${stage.company}`,
    ids,
  }
}

/** Filter for every project using a given tool. */
export function tagFilter(tag) {
  return { kind: "tag", key: `tag-${tag}`, label: tag, tag }
}

/** Apply a cross-filter. Returns all projects when there isn't one. */
export function applyFilter(filter) {
  if (!filter) return projects
  if (filter.kind === "period") return projects.filter((p) => filter.ids.includes(p.id))
  if (filter.kind === "tag") return projects.filter((p) => p.tags.includes(filter.tag))
  return projects
}

/** How many projects a tool appears in — drives the count on each toolkit chip. */
export function countForTag(tag) {
  return projects.filter((p) => p.tags.includes(tag)).length
}
