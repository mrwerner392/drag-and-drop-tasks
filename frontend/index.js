
const unfinishedTasks = document.querySelector('#unfinished-tasks');
const finishedTasks = document.querySelector('#finished-tasks');


fetch('http://localhost:3000/tasks')
.then(res => res.json())
.then(tasksArr => {
  tasksArr.forEach(task => handleTask(task))
});


function handleTask(task) {

  let taskPTag = document.createElement('p');
  taskPTag.innerText = task.content;
  taskPTag.id = `task ${task.id}`;
  taskPTag.classList.add('task');
  taskPTag.dataset.databaseId = task.id;

  if (task.finished === true) {
    taskPTag.dataset.id = 'finished';
    finishedTasks.append(taskPTag);
  } else {
    taskPTag.dataset.id = 'unfinished'
    unfinishedTasks.append(taskPTag);
  };

  taskPTag.setAttribute('draggable', 'true');
  addDragEventListeners(task, taskPTag);

};


function addDragEventListeners(task, taskPTag) {

  taskPTag.addEventListener('dragstart', evt => {
    evt.dataTransfer.setData('text', evt.target.id);
  }, false);

  taskPTag.addEventListener('dragend', evt => {
    evt.dataTransfer.clearData();
    if (document.querySelector('.over')) {
      document.querySelector('.over').classList.remove('over');
    };
  });

};


addDropzoneEventListeners(unfinishedTasks);
addDropzoneEventListeners(finishedTasks);


function addDropzoneEventListeners(dropzone) {

  dropzone.addEventListener('dragover', evt => {
    evt.preventDefault();
    evt.currentTarget.classList.add('over');
  }, false);

  dropzone.addEventListener('dragleave', evt => {
    evt.preventDefault();
    evt.currentTarget.classList.remove('over');
  }, false);

  dropzone.addEventListener('drop', evt => {

    let elemId = evt.dataTransfer.getData('text');
    let droppedElem = document.getElementById(elemId);

    if (droppedElem.dataset.id !== evt.currentTarget.dataset.id) {

      evt.currentTarget.append(droppedElem);
      evt.dataTransfer.clearData();

      const dataIdToggle = {
        'finished': 'unfinished',
        'unfinished': 'finished'
      };
      droppedElem.dataset.id = dataIdToggle[droppedElem.dataset.id];

      const databaseAttributeMap = {
        'finished': true,
        'unfinished': false
      };
      let isFinished = databaseAttributeMap[droppedElem.dataset.id];
      let id = droppedElem.dataset.databaseId;

      fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          'finished': isFinished
        })
      })
      .then(res => res.json())
      .then(task => {
        task.finished === true ? alert('Way to Go!!!') : alert('Darn 😕')
      });

    };

  }, false);

};
