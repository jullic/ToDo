import {typeTask} from './changeTypeTasks';

const task = () => {
    const tasksContainer = document.querySelector('.todo__tasks');
    const addTaskBtn = document.querySelector('.todo__create-task');
    const place = document.querySelector('.todo__place');
    const typeTasks = document.querySelector('.todo__choose-btns');
    
    
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    
    class Task {
        constructor() {
            this.text = '';
            this.descr = '';
            this.completed = false;
            this.list = [];
            this.addListBtn = true;
        }
    }

    renderTasks(false, typeTask);



    // Accessory functions //

    function checkParent(target, parentClass, isSearch = false) {
        let container = target;
        while(true) {
            if (container === null) return;
            if (container.classList.contains(parentClass)) {
                if (isSearch) {
                    return container;
                }
                return true;
            }
            if (container.tagName === 'BODY') {
                return false;
            }
            container = container.parentElement;
        }
    }



    // Animation //
    



    // Interactive // 

    function removeToAnotherType(task) {
        if (task.completed) {
            task.completed = false;
            task.element.querySelector('.todo__task-checkbox').classList.remove('completed');
        }
        else {
            task.completed = true;
            task.element.querySelector('.todo__task-checkbox').classList.add('completed');
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks(false, typeTask);
        updateLocalStorage();
    }


    // Events //

    typeTasks.addEventListener('click', () => {
        renderTasks(false, !typeTask);
    }); 
    

    addTaskBtn.addEventListener('click', () => {
        tasks.push(new Task());
        renderTasks(true, typeTask);
        updateLocalStorage();
    });

    tasksContainer.addEventListener('click', (e) => {
        
        if (e.target && checkParent(e.target, 'todo__task') && !checkParent(e.target, 'todo__task', true).classList.contains('active')) {
            tasks.forEach(task => {
                task.element.classList.remove('active');
            });
            tasks[checkParent(e.target, 'todo__task', true).getAttribute('data-index')].element.classList.add('active');
            tasks[checkParent(e.target, 'todo__task', true).getAttribute('data-index')].element.style.maxHeight = tasks[checkParent(e.target, 'todo__task', true).getAttribute('data-index')].height + 'px';

            if (!checkParent(e.target, 'todo__task-checkbox')) {
                return;
            }
        }
        if (e.target && checkParent(e.target, 'todo__task-checkbox')) {
            tasks.forEach(task => {
                task.element.classList.remove('active');
            });
            removeToAnotherType(tasks[checkParent(e.target, 'todo__task', true).getAttribute('data-index')]);
            updateLocalStorage();
        }
        if (e.target && checkParent(e.target, 'todo__task-delete')) {
            deleteTask(checkParent(e.target, 'todo__task', true).getAttribute('data-index'));
        }

        if (e.target && checkParent(e.target, 'todo__task-create-list')) {
            createTaskListItem(checkParent(e.target, 'todo__task', true).getAttribute('data-index'));
            tasks[checkParent(e.target, 'todo__task', true).getAttribute('data-index')].element.classList.add('active');
            updateLocalStorage();
        }

        if (e.target && checkParent(e.target, 'todo__task-list-item-checkbox')) {
            if (e.target.classList.contains('true')) {
                checkCheckboxes(checkParent(e.target, 'todo__task', true).getAttribute('data-index'), checkParent(e.target, 'todo__task-list-item-checkbox', true).getAttribute('data-checkbox-index'), false);
            }
            else {
                checkCheckboxes(checkParent(e.target, 'todo__task', true).getAttribute('data-index'), checkParent(e.target, 'todo__task-list-item-checkbox', true).getAttribute('data-checkbox-index'), true);
            }
            e.target.classList.toggle('true');
            updateLocalStorage();
        }

    });


    place.addEventListener('click', (e) => {
        if (e.target.classList.contains('todo__place')) {
            tasks.forEach(task => {
                task.element.classList.remove('active');
            });
        }
    });
    
    

    // Add task //

    function createTask(obj, index) {
        const li = document.createElement('li');
        li.classList.add('todo__task');
        li.setAttribute('data-index', index);
        li.innerHTML = `
        <div class="todo__task-main-info">
            <button class="todo__task-checkbox ${obj.completed ? 'completed' : ''}"></button>
            <textarea class="todo__task-input" name="task" placeholder="Новая задача">${obj.text}</textarea>
            <div class="todo__task-main-btns">
                <button class="todo__task-create-list ${obj.addListBtn ? 'active' : ''}">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <button class="todo__task-delete">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3984 12.5234H15.0391V25.6484H13.3984V12.5234Z" fill="white"/>
                        <path d="M16.6797 12.5234H18.3203V25.6484H16.6797V12.5234Z" fill="white"/>
                        <path d="M19.9609 12.5234H21.6016V25.6484H19.9609V12.5234Z" fill="white"/>
                        <path d="M6.83594 7.60156H28.1641V9.24219H6.83594V7.60156Z" fill="white"/>
                        <path d="M25.046 8.42187H23.513V6.78125C23.513 6.28906 19.6329 5.90625 19.1407 5.90625C17.8593 5.90625 17.1408 5.90625 15.8594 5.90625C15.3672 5.90625 11.4871 6.28906 11.4871 6.78125L11.487 8.42187H9.9541L9.95412 6.78125C9.95412 5.46875 13.8687 4.375 15.8594 4.375C17.8501 4.375 17.1501 4.375 19.1407 4.375C21.1312 4.375 25.046 5.46875 25.046 6.78125V8.42187Z" fill="white"/>
                        <path d="M22.4219 30.5703H12.5781C11.2656 30.5703 10.1172 29.4766 10.0078 28.1641L8.47656 8.47656L10.1172 8.36719L11.6484 28.0547C11.7031 28.5469 12.1406 28.9297 12.5781 28.9297H22.4219C22.9141 28.9297 23.3516 28.4922 23.3516 28.0547L24.8828 8.36719L26.5234 8.47656L24.9922 28.1641C24.8828 29.5312 23.7344 30.5703 22.4219 30.5703Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
        <textarea class="todo__task-descr" name="" placeholder="Заметки">${obj.descr}</textarea>`;
        li.append(createTaskList(obj));

        return li;
    }

    function createTaskListItem(index) {
        tasks[index].list.push({completed: false, text: ''});
        renderTasks(false, typeTask);
    }

    function createTaskList(obj) {
        let ul = document.createElement('ul');
        ul.classList.add('todo__task-list');
        obj.list.forEach((item, index) => {
            ul.innerHTML += `
            <li class="todo__task-list-item">
                <button class="todo__task-list-item-checkbox ${item.completed}"  data-checkbox-index="${index}"></button>
                <input class="todo__task-list-item-text" type="text" value="${item.text}">
            </li>`;
        });

        return ul;
    }

    function addInputEvent(task, index) {
        task.mainInput = task.element.querySelector('.todo__task-input');
        task.mainInput.addEventListener('input', () => {
            task.text = task.mainInput.value;
            updateLocalStorage();
        });

        task.descrInput = task.element.querySelector('.todo__task-descr');
        task.descrInput.addEventListener('input', () => {
            task.descr = task.descrInput.value;
            updateLocalStorage();
        });
        try {
            tasks.listInputs = tasks[index].element.querySelectorAll('.todo__task-list-item-text');
            tasks.listInputs.forEach((input, i) => {
                input.addEventListener('input', () => {
                    tasks[index].list[i].text = input.value;
                    updateLocalStorage();
                });
            });
        }
        catch(e) {}
    }

    function renderTasks(lastTaskActive, typeTask = true) {
        tasksContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            tasksContainer.append(task.element = createTask(task, index));
            if(task.completed !== typeTask) {
                task.element.style.display = 'none';
            }
            addInputEvent(task, index);
            setTimeout(() => {
                task.element.style.transition = 'all 0.5s ease';
            }, 100);
        });
        if (lastTaskActive && tasks.length > 0) {
            tasks[tasks.length - 1].element.classList.add('active');
        }
    }


    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function checkCheckboxes(taskIndex, checkboxIndex, result) {
        tasks[taskIndex].list[checkboxIndex].completed = result;
    }

};

export default task;