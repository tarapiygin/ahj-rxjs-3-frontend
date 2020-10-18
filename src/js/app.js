import {
  pluck, distinctUntilChanged,
} from 'rxjs/operators';
import ProjectsWidget from './ProjectsWidget';
import Tasks from './Tasks';
import Store from './Store';
import jsonData from './data.json';

const data = {
  projects: jsonData,
};
const storeList = [];
const projects = new ProjectsWidget(data.projects);
projects.init();
const tasks = new Tasks(data.projects);
tasks.init();

for (const item of data.projects) {
  let counter = 0;
  item.tasks.forEach((task) => {
    if (!task.done) counter += 1;
  });
  storeList[item.id] = new Store(counter);
  storeList[item.id].state$
    .pipe(
      pluck('counter'),
      distinctUntilChanged(),
    )
    .subscribe((value) => {
      document.querySelector(`[data-id='${item.id}']`).querySelector('.project-open-counter').innerText = value;
    });
}

tasks.container.addEventListener('click', (event) => {
  if (document.querySelector('.modal-active')) return;
  if (event.target.classList.contains('task-status')) {
    const target = event.target.closest('.task-item');
    const { id } = target.dataset;
    const projectIndex = data.projects.findIndex((el) => el.name === document.querySelector('.task-header-value').innerText);
    const projectId = data.projects[projectIndex].id;
    const indexTask = data.projects[projectIndex].tasks.findIndex((el) => el.id === Number(id));
    if (target.classList.contains('task-done')) {
      storeList[projectId].inc(1);
      target.classList.remove('task-done');
      data.projects[projectIndex].tasks[indexTask].done = false;
    } else {
      storeList[projectId].dec(1);
      target.classList.add('task-done');
      data.projects[projectIndex].tasks[indexTask].done = true;
    }
  }
});
