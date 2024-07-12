const page = document.querySelector(".slip");

const downloadBtn = document.querySelector(".download");

// download the slip
downloadBtn.addEventListener("click", () => {
  html2canvas(page).then((canvas) => {
    let base64Image = canvas.toDataURL("image/png");
    let pdf = new jsPDF("p", "px", [650, 800]);
    pdf.addImage(base64Image, "JPG", 15, 15, 570, 600);
    pdf.save("aknowledgemnent-slip.pdf");
  });
});
