/* eslint-disable @typescript-eslint/naming-convention -- The settings are snake case. */
/**
 * @copyright NHCarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import type { PdfConfig } from "md-to-pdf/dist/lib/config.js";

export const options: Partial<PdfConfig> = {
  pdf_options: {
    displayHeaderFooter: true,
    footerTemplate:      `<section>
      <div class="flexy"><p><a href='https://chat.nhcarrigan.com'>Join Naomi's Discord</a></p><p>Page <span class="pageNumber"></span>
        of <span class="totalPages"></span></p></div>
    </section>`,
    format:         "Legal",
    headerTemplate: `    <style>
      section {
        margin: 0 auto;
        font-family: system-ui;
        font-size: 11px;
        width: 100%;
      }
      .flexy {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
      }
      .centre {
        text-align: center;
      }
    </style>
    <section class="centre">
      <span>Naomi's freeCodeCamp Review</span>
    </section>`,
    margin: {
      bottom: "0.75in",
      left:   "0.75in",
      right:  "0.75in",
      top:    "0.75in",
    },
  },
};
