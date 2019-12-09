window.onload(() => {

    const checkbox = querySelectorAll('.checkbox');
    checkbox.addEventListener('checked', (e) => {
        console.log(e.target);
    });

});