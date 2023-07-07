const summaryCheck = document.querySelector('.summary-check');

summaryCheck.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
        try {
            const res = await fetch(`/summary-ai?input=${summaryCheck.value}`, { method: 'GET' });
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
