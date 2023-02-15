const resume = document.querySelector('.resume');
const headers = document.querySelectorAll('.header');
const colorSelector = document.querySelector('.color-selector');
const colors = Array.from(document.querySelectorAll('.color'));
const currentIcon = document.querySelector('.current-icon');
const btnDownload = document.querySelector('.btn-download');

const changeResumeColor = e => {
  if (e.target.classList.contains('color')) {
    const target = e.target;
    const newColor = window.getComputedStyle(target).backgroundColor;

    resume.style.borderTop = `8px solid ${newColor}`;

    headers.forEach(header => (header.style.color = `${newColor}`));

    colors.find(color => color.contains(currentIcon)).removeChild(currentIcon);

    // Add icon to color option to show that it is the current color
    target.append(currentIcon);
  }
};

const generatePDF = async function () {
  const doc = new jsPDF();
  doc.fromHTML(resume, 30, 15, { width: 170 }, () => doc.save('resume.pdf'));
};

colorSelector.addEventListener('click', changeResumeColor);
btnDownload.addEventListener('click', generatePDF);
