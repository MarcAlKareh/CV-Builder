const btnDelete = document.querySelectorAll('.delete-icon');
const btnAdd = document.querySelector('.btn-add');
const addIcon = document.querySelector('.plus-icon');

const deleteJob = async function (btn) {
  // Delete data from backend
  const jobName = btn.previousElementSibling.textContent.split(' | ')[0];
  console.log(jobName);

  // Delete element from UI
  btn.parentElement?.parentElement?.removeChild(btn.parentElement);

  // Send data to server
  const res = await fetch(`/delete?jobName=${jobName}`, {
    method: 'GET',
  });

  const { url } = await res.json();

  window.location.href = url;
};

btnAdd.addEventListener('mouseover', () => {
  addIcon.style.stroke = '#fff';
});

btnAdd.addEventListener('mouseout', () => {
  addIcon.style.stroke = '#e67700';
});

btnDelete.forEach(btn => btn.addEventListener('click', () => deleteJob(btn)));
