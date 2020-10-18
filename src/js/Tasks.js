export default class Tasks {
  constructor(data) {
    this.container = document.getElementById('tasks');
    this.changeProject = document.querySelector('.task-header-value');
    this.modal = document.querySelector('.modal');
    this.data = data;
  }

  init() {
    this.drawTasks(this.data);
    this.action();
  }

  drawTasks(data) {
    this.container.innerHTML = '';
    data.forEach((el) => {
      if (el.name === this.changeProject.innerText) {
        el.tasks.forEach((item) => {
          const task = document.createElement('tr');
          task.className = `task-item ${item.done === true ? 'task-done' : ''}`;
          task.dataset.id = item.id;
          task.innerHTML = `
            <td class="task-status"></td>
            <td class="task-name">${item.name}</td>
          `;
          this.container.appendChild(task);
        });
      }
    });
  }

  action() {
    this.changeProject.addEventListener('click', () => {
      this.modal.classList.add('modal-active');
    });
    this.modal.addEventListener('click', (event) => {
      if (event.target.classList.contains('project')) {
        if (this.changeProject.innerText !== event.target.innerText) {
          document.querySelector('.active-project').classList.remove('active-project');
          event.target.classList.add('active-project');
          this.changeProject.innerText = event.target.innerText;
          this.drawTasks(this.data);
        }
        this.modal.classList.remove('modal-active');
      }
    });
  }
}
