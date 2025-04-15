import { HumanizeDurationLanguage, HumanizeDuration } from "humanize-duration-ts";

const shortEn : HumanizeDurationLanguage = new HumanizeDurationLanguage();
shortEn.addLanguage("shortEn", {
    y: () => "y",
    mo: () => "mo",
    w: () => "w",
    d: () => "d",
    h: () => "h",
    m: () => "m",
    s: () => "s",
    ms: () => "ms",
    decimal: "."
});

const humanizer = new HumanizeDuration(shortEn);
export default humanizer;