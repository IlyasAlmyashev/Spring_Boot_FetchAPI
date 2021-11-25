$(async function () {
    await getTableWithUsers();
    await getNewUserForm();
    await getDefaultModal();
    await addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;utf-8',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8080/api/users'),
    findAllRoles: async () => await fetch('http://localhost:8080/api/roles'),
    findOneUser: async (id) => await fetch(`http://localhost:8080/api/${id}`),
    addNewUser: async (user) => await fetch('http://localhost:8080/api/', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8080/api/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    })
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.phoneNumber}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(function (role) {
                    return `<p style="display: inline;">${role.roleName.substr(5) + " "}</p>`
                })}
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    form.show();
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let roless = await userFetchService.findAllRoles();

    let user = preuser.json();
    let roles = roless.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  type="button" class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button form="editUser" type="submit" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        roles.then(roles => {
            let bodyForm = `
            <form class="form-group" id="editUser">
            
                <label for="editId" class="form-label ">ID</label>
                <input type="text" class="form-control" id="editId" name="id" value="${user.id}" disabled><br>
                
                <label for="editUsername" class="form-label ">Username</label>
                <input type="text" class="form-control" id="editUsername" name="username" value="${user.username}"><br>
                
                <label for="editPassword" class="form-label ">Password</label>
                <input type="password" class="form-control" id="editPassword" name="password" value="${user.password}"><br>
                
                <label for="editFirstName" class="form-label ">First Name</label>
                <input type="text" class="form-control" id="editFirstName" name="firstName" value="${user.firstName}"><br>
                
                <label for="editLastName" class="form-label ">Last Name</label>
                <input type="text" class="form-control" id="editLastName" name="lastName" value="${user.lastName}"><br>
                
                <label for="editPhoneNumber" class="form-label ">Phone Number</label>
                <input type="text" class="form-control" id="editPhoneNumber" name="age" value="${user.phoneNumber}"><br>
                
                <label for="editEmail" class="form-label ">Email</label>
                <input type="text" class="form-control" id="editEmail" name="email" value="${user.email}"><br>
                
                <label for="editRoles">Roles</label>
                <select multiple size=${roles.length} name="roles"
                 class="form-control" id="editRoles" style="text-align:left;">
                 ${roles.map(function (role) {
                return `<option value="${role.roleName}">${role.roleName}</option>`})}
                </select>
                <br/>
                </label>
                
            </form>
        `;
            modal.find('.modal-body').append(bodyForm);
        })
    })
    $("#editButton").on('click', async () => {
        let id = modal.find("#editId").val().trim();
        let username = modal.find("#editUsername").val().trim();
        let password = modal.find("#editPassword").val().trim();
        let firstName = modal.find("#editFirstName").val().trim();
        let lastName = modal.find("#editLastName").val().trim();
        let phoneNumber = modal.find("#editPhoneNumber").val().trim();
        let email = modal.find("#editEmail").val().trim();
        let rolesA = modal.find("#editRoles").val();
        let data;
        if (rolesA.length > 1) {
            data = {
                id: id,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesA[0]),
                        users: null
                    },
                    {
                        id: 1,
                        roleName: String(rolesA[1]),
                        users: null
                    }
                ]
            }
        } else {
            data = {
                id: id,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesA),
                        users: null
                    }
                ]
            }
        }

        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    await userFetchService.deleteUser(id);
    await getTableWithUsers();
    modal.find('.modal-title').html('');
    modal.find('.modal-body').html('User was deleted');
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
}

async function addNewUser() {
    $('#AddNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')

        let username = addUserForm.find("#AddNewUserName").val().trim();
        let password = addUserForm.find("#AddNewUserPassword").val().trim();
        let firstName = addUserForm.find("#AddNewUserFirstName").val().trim();
        let lastName = addUserForm.find("#AddNewUserLastName").val().trim();
        let phoneNumber = addUserForm.find("#AddNewUserPhoneNumber").val().trim();
        let email = addUserForm.find("#AddNewUserEmail").val().trim();
        let rolesA = addUserForm.find("#AddNewUserRoles").val();
        let data;
        if (rolesA.length > 1) {
            data = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesA[0]),
                        users: null
                    },
                    {
                        id: 1,
                        roleName: String(rolesA[1]),
                        users: null
                    }
                ]
            }
        } else {
            data = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesA),
                        users: null
                    }
                ]
            }
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();
            addUserForm.find('#AddNewUserName').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserFirstName').val('');
            addUserForm.find('#AddNewUserLastName').val('');
            addUserForm.find('#AddNewUserPhoneNumber').val('');
            addUserForm.find('#AddNewUserEmail').val('');
            addUserForm.find('#AddNewUserRoles').val('');
            $('#table-tab').click();
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger    alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}