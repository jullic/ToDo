import task from './modules/task';
import {changeTypeTasks} from './modules/changeTypeTasks';


window.addEventListener('DOMContentLoaded', () => {
    task();
    changeTypeTasks();

    // const textareaHeight = document.querySelector('.todo__task-input');
    

    // textareaHeight.addEventListener("input", () => {
    //     textareaHeight.style.height = 0;
    //     textareaHeight.style.height = textareaHeight.scrollHeight + "px";
    // })
});
