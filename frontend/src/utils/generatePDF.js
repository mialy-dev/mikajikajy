
import html2pdf from "html2pdf.js";

export function generatePV(elementId, numero) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Document PV introuvable");
  }

  html2pdf()
    .set({
      margin: 10,
      filename: `PV-${numero}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: {
        mode: ["css", "legacy"]
      }
    })
    .from(element)
    .save();
}
