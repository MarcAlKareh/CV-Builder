const btnDelete = document.querySelectorAll('.delete-icon');

const deleteJob = async function (btn) {
  // Delete data from backend
  const jobName = btn.previousElementSibling.textContent.split(' | ')[0];
  console.log(jobName);

  // Delete element from UI
  btn.parentElement?.parentElement?.removeChild(btn.parentElement);

  // Send post request to server
  const res = await fetch(`/delete?jobName=${jobName}`, {
    method: 'GET',
  });

  const { url } = await res.json();

  window.location.href = url;
};

btnDelete.forEach(btn => btn.addEventListener('click', () => deleteJob(btn)));
