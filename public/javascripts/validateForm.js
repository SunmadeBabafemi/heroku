(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    
})()
// const imageUrl = document.getElementById('image')
// function ValidURL(imageUrl) {
//     var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
//         '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
//         '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
//         '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
//         '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
//         '(\#[-a-z\d_]*)?$','i'); // fragment locater
//     if(!pattern.test(str)) {
//         alert("Please enter a valid URL.");
//         return false;
//     } else {
//         return true;
//     }
// }