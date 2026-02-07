// Override Imports
import appbar from "@themes/overrides/appbar";
import button from "@themes/overrides/button";
import card from "@themes/overrides/card";
import input from "@themes/overrides/input";
import select from "@themes/overrides/select";
import table from "@themes/overrides/table";
import text from "@themes/overrides/text";
import typography from "@themes/overrides/typography";
import label from "./label";
// import datepicker from "@themes/overrides/datepicker";
import paper from "./paper";
import chip from "./chip";

const overrides = () => {
  return Object.assign(
    {},
    button,
    card,
    input,
    appbar,
    select,
    table,
    text,
    typography,
    label,
    chip,
    // datepicker,
    paper
  );
};

export default overrides;
