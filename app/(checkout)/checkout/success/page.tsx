/**
 * The confirmation page lives at `/success` inside the route group, but the
 * product spec (and every link that points at it) uses `/checkout/success`.
 * A route group does not contribute a URL segment, so this file mounts the
 * same page at the address the spec asks for.
 */
export { default, metadata } from "../../success/page";
