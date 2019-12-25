/** 
 * функция обработчик удаления события
 * @param target event.target
 **/
async function handleDelete(target) {
    const { dataset: { id } } = target;
    const result = await fetch('/tasks', {
         method: 'DELETE',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({ id })
     });

    if ( result ) {
        target.parentNode.parentNode.remove();
    }
}

/** 
 * функция обработчик удаления события
 * @param target event.target
 **/
async function handleToggleStatus(target) {
    const { dataset: { id } } = target;
    const result = await fetch(`/tasks/${ id }`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
     });

    if ( result ) {
        target.value = result;
    }
}

/** переход на страницу указаную в дада атрибуте */
function handleChangeLocation(target) {
    const { dataset: { href } } = target;
    location.href = href;
}

async function handleCreateTask(socket) {
    const title = document.querySelector('#new_task_title').value;
    const user = JSON.parse( localStorage.getItem('user') );
    socket.emit('create', { title, userId: user._id });
}

window.addEventListener('load', () => {
    const container = document.querySelector('.tasks__container');
    const user = localStorage.getItem('user') ? JSON.parse( localStorage.getItem('user') ) : null;
    const token = localStorage.getItem('token');

    if ( !token ) {
        window.location = '/login';
    }

    const socket = io.connect(`http://localhost:3000?token=${token}`);

    if ( container ) {
        container.addEventListener( 'click', ( event ) => {
            const { target } = event;
            const { classList } = target;
            if ( classList.contains( 'btn_delete' ) ) {
                handleDelete(target);
            } else if ( classList.contains( 'btn_check' ) ) {
                handleToggleStatus(target);
            } else if ( classList.contains( 'btn_update' ) ) {
                handleChangeLocation( target );
            } else if ( classList.contains( 'btn_create' ) ) {
                handleCreateTask( socket );
            }
        });
    }

    socket.on(`created:${user._id}`, (task) => {
        console.log('+')
        const $tableBody = document.querySelector('.tasks.tbody');
        const itemHtml = `
                <tr>
                    <td>${ task.title }</td>
                    <td>
                        <input class="btn_check" type="checkbox" data-id="${ task._id }" ${ task.completed ? 'checked' : '' }/>
                    <td>
                        <button class="btn_update" data-href="/tasks/update/${ task._id }">Update</button>
                        <button class="btn_delete" data-id="${ task._id }">Delete</button>
                    </td>    
                </tr>
        `;

        const $tr = document.createElement('tr');
        $tr.innerHTML = itemHtml;
        $tableBody.appendChild($tr);
    }); 
});