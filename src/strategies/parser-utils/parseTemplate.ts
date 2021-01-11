import { ComponentInterface } from "../../lib/types.ts";
import Utils from "../../lib/utils.ts";

// parseTemplate is responsible for parsing template tags
export default function parseTemplate(current: ComponentInterface) {
  try {
    // remove '\r' to prevent isolation error
    current.split = current.split?.map((piece: string) => piece.replace("\r", ""));
    if (current.split) {
      const { split } = current;
      // isolate the content inside <template>
      const open: number = split.indexOf("<template>");
      const close: number = split.indexOf("</template>");

      if (open < 0 || close < 0) {
        throw (
          `There was an error isolating content inside of <template> tags for ${current.label}.vue`
        );
      }
      // stringify, trim, remove comments, and save on template property
      current.template = Utils.sliceAndTrim(split, open + 1, close)
                              .replace(Utils.htmlCommentPattern, "");
      // slice the split property to minimize the length of data
      current.split = split.slice(close + 1);
    }
  } catch (error) {
    console.error(
      "Error inside of parseTemplate()=>:",
      { error },
    );
  }
}
