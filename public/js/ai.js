const summaryCheck = document.querySelector('.summary-check');
const btnAI = document.querySelector('.btn-ai');
const chatIcon = document.querySelector('.chat-icon');
const closeIcon = document.querySelector('.close-icon');

summaryCheck.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    try {
      const currentUrl = window.location.pathname;
      let q = '';

      if (currentUrl === '/education') {
        q =
          'I am writing a CV and I need you to write a description for the education section using this information in 2-3 sentences';
      } else if (currentUrl === '/summary') {
        q =
          'I am writing a professional summary for my CV. Here are some of the details you need to write me a professional summary and please make it 4 lines long';
      } else {
        q =
          'I am writing a CV and I need three bullet points as part of my responsibilities during a position. Here are three main tasks I did and the job';
      }

      const res = await fetch(
        `/summary-ai?input=${summaryCheck.value}&q=${q}`,
        {
          method: 'GET',
        }
      );
      const { reply } = await res.json();
      summaryCheck.value = `
            ${summaryCheck.value}
                
            ${reply}
            `;
    } catch (err) {
      console.log(err.message);
    }
  }
});

btnAI.addEventListener('click', () => {
  if (summaryCheck.classList.contains('hidden')) {
    summaryCheck.classList.remove('hidden');
    chatIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    summaryCheck.classList.add('hidden');
    closeIcon.classList.add('hidden');
    chatIcon.classList.remove('hidden');
  }
});
