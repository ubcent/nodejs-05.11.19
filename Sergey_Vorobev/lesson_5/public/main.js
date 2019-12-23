window.onload = () => {

    const checkbox = document.querySelectorAll('.checkbox');
    checkbox.forEach(elem => {
        elem.addEventListener('change', e => {
            if (e.target.checked) {
                completed(e.target.id, true);
            } else {
                completed(e.target.id, false);
            }
        })
    });

};

completed = (id, completed) => {
    fetch('/completed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset = utf-8'
        },
        body: JSON.stringify({
            'id': id,
            'completed': completed,
        })
    })
}