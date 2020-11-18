$(document).ready(function(){
    let nameOfContact = $('.name-input')
    let lastNameOfContact = $('.last-name-input')
    let phoneNumberOfContact = $('.phone-number-input')
    let btn = $('.btn')
    let list = $('.contact-list')
    let modal = $("#my_modal");
    let span = $(".close_modal_window");
    let btnSave = $('.btn-save')
    let inpEditName = $('.inp-edit-name')
    let inpEditLastName = $('.inp-edit-lastname')
    let inpEditPhoneNumber = $('.inp-edit-phone-number')
    let page = 1
    let pageCount = 0
    let searchValue = ''

    $('.search-inp').on('input', function(e){
        searchValue = e.target.value
        render()
    })

    function get_pageCount(){
        fetch('http://localhost:8000/contacts')
        .then(res => res.json())
        .then(data => {
          pageCount = Math.ceil(data.length / 2)
          $('.pagination-page').html('')
          for(let i = 1; i <= pageCount; i++){
            $('.pagination-page').append(`
            <a href="#" alt="..."> 
            ${i}
            </a>
            `)
          }
        })
    }


    btn.on('click', function(){
        if(!nameOfContact.val() || !phoneNumberOfContact.val()) return
        let newContact = {
            name: nameOfContact.val(),
            lastName: lastNameOfContact.val(),
            phoneNumber: phoneNumberOfContact.val()
        }
        addContact(newContact)
        inp.val('')
    })

    function addContact(data){
        fetch('http://localhost:8000/contacts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then(() => render())
    }


    async function render(){
        let res= await fetch(`http://localhost:8000/contacts?_page=${page}&_limit=2&q=${searchValue}`)
        let all_contacts = await res.json()
        list.html('')
        all_contacts.forEach(elem => {
            list.append(
                `<li id=${elem.id}><strong>name: </strong> ${elem.name} <br> 
                <strong>lastname: </strong>${elem.lastName} <br> 
                <strong> phone number:</strong> ${elem.phoneNumber} <br> 
                <button class="btn-delete">Delete</button>
                <button class="btn-edit">Edit</button></li>`
                )
        })
        get_pageCount()
    }

    $('body').on('click', '.btn-delete', function(e){
        let id = e.target.parentNode.id
        fetch(`http://localhost:8000/contacts/${id}/`, {
            method: 'DELETE'
        })
        render()
    })

    $('body').on('click', '.btn-edit', function(event){
        // event.stopPropagation()
        let id = event.target.parentNode.id
        fetch(`http://localhost:8000/contacts/${id}`)
        .then(res => res.json())
        .then(data => {
          inpEditName.val(data.name)
          inpEditLastName.val(data.lastName)
          inpEditPhoneNumber.val(data.phoneNumber)
          btnSave.attr('id', id)
          modal.css('display', 'block')
        })
    })

    btnSave.on('click', function(event){
        let editNameValue = inpEditName.val()
        let editLastNameValue = inpEditLastName.val()
        let editPhoneNumberValue = inpEditPhoneNumber.val()
        let id = event.target.id
        let obj = {}
        if(editNameValue) obj.name = editNameValue
        if(editLastNameValue) obj.lastName = editLastNameValue
        if(editPhoneNumberValue) obj.phoneNumber = editPhoneNumberValue
        fetch(`http://localhost:8000/contacts/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(obj),
          headers: {'Content-type': 'application/json'}
        })
          .then(() => {
            render()
            modal.css('display', 'none')
          })
    })

    span.on('click', function(event) {
        event.stopPropagation()
        modal.css('display', 'none');
        render()
    })

    $(window).on('click', function(event) {
        if ($(event.target).is(modal)){
            modal.css('display', 'none');
        }
        render()
    })

    $('body').on('click', '.pagination-page', function(e){
        page = e.target.innerText
        render()
    })

    $('.next-btn').on('click', function(){
        if(page >= pageCount) return
        page++
        render()
      })
      
    $('.previous-btn').on('click', function(){
        if(page <= 1) return
        page--
        render()
    })
    
    render()
})
