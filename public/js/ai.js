const summaryCheck = document.querySelector('.summary-check');
const btnAI = document.querySelector('.btn-ai');
const chatIcon = document.querySelector('.chat-icon');
const closeIcon = document.querySelector('.close-icon');

summaryCheck.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    try {
      const res = await fetch(`/summary-ai?input=${summaryCheck.value}`, {
        method: 'GET',
      });
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
