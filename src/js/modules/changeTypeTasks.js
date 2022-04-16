let typeTask = false;
const changeTypeTasks = () => {
    const btns = document.querySelector('.todo__choose-btns');
    
    btns.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('todo__choose-btn')) {
            btns.children.forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            if (e.target.classList.contains('todo__tasks-btn')) {
                typeTask = false;
            }
            else {
                typeTask = true;
            }
        }
    });
        
};

export {changeTypeTasks, typeTask};