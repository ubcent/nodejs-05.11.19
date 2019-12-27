/** переход на страницу указаную в дада атрибуте */
function handleChangeLocation(target) {
    const { dataset: { href } } = target;
    location.href = href;
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
            const { classList, dataset: { id } } = target;
          
            if ( classList.contains( 'btn_create' ) ) {
                const title = document.querySelector('#new_task_title').value;
                const user = JSON.parse( localStorage.getItem('user') );
                socket.emit('create', { title, userId: user._id });
            } else if ( classList.contains( 'btn_delete' ) ) {
                socket.emit('delete', id );
            } else if ( classList.contains( 'btn_check' ) ) {
                socket.emit('toggle', id );
            } else if ( classList.contains( 'btn_update' ) ) {
                handleChangeLocation( target );
            }
        });
    }

    socket.on(`created:${ user._id }`, ({ _id, title, completed }) => {
        const $tableBody = document.querySelector('.tasks.tbody');
        const $tr = document.createElement('tr');
        $tr.classList.add('task__row');
        $tr.dataset.id = _id;

        const itemHtml = `
            <td>${ title }</td>
            <td>
                <input class="btn_check" type="checkbox" data-id="${ _id }" ${ completed ? 'checked' : '' }/>
            <td>
                <button class="btn_update" data-href="/tasks/update/${ _id }">Update</button>
                <button class="btn_delete" data-id="${ _id }">Delete</button>
            </td> 
        `;

        $tr.innerHTML = itemHtml;
        $tableBody.appendChild($tr);
    });

    socket.on('deleted', ( taskId ) => {
        const $row = document.querySelector( `.task__row[data-id="${ taskId }"]` );
        $row.remove();
    });

    socket.on('toggle', ( taskId ) => {
        const $checkBox = document.querySelector( `.task__row[data-id="${ taskId }"] .btn_check` );
        $checkBox.checked = !$checkBox.checked;
    });
});