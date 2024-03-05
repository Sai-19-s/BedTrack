document.addEventListener('DOMContentLoaded', function () {
    let floor_idx;
    let room_idx;
    let addIdx;
    let owner_id;
    owner_id = document.querySelector('.roomlist').getAttribute('owner_id');


    /* Script for navbar */
    let subnavbar = document.querySelector(".subnavbar");
    let homedata = document.querySelector('.homedata');
    let homebtn = document.querySelector('.home');
    let activeFloor = null;

    document.querySelector(".navlist").addEventListener('click', displayRooms)
    function displayRooms(e){
        if(tenentform[0].style.display === 'block'){
            tenentform[0].style.display = 'none';
            mainDetails.style.justifyContent = 'center';
        }
        if(activeroom){
            activeroom.style.color = 'olive';
            tenentDetails.classList.remove('detailsVisible');
        };
          
        if (e.target.classList.contains('home')){

            homebtn.style.color = homebtn.style.color == 'white' ? 'black' : 'white';
            homedata.classList.toggle('homevisible')

            if (activeFloor){
                subnavbar.classList.remove('visible');
                activeFloor.style.color = 'black';
            }
        }
        else if (e.target.matches('li')){
            floor_idx = e.target.getAttribute('index')
            
            homedata.classList.add('homevisible');
            homebtn.style.color = 'black';
            
            if (activeFloor !== e.target){
                if(activeFloor){
                    subnavbar.classList.remove('visible')
                    activeFloor.style.color = 'black';
                }
                subnavbar.classList.add('visible')
                e.target.style.color = 'white';
                activeFloor = e.target;
            }
            else{
                e.target.style.color = e.target.style.color === 'white' ? 'black' : 'white';
                subnavbar.classList.toggle('visible');
            };
        };
    };

    /* Script for open tenants table */
    let tenentDetails = document.getElementById('tenentDetails');
    let room = document.querySelectorAll('li[class^=room]');
    let activeroom = null;

    room.forEach(function(item){
        item.addEventListener('click', displayTenants)
    });
    function displayTenants(e){
        room_idx = e.target.getAttribute('index')
        
        if(activeroom !== e.target){
            if(activeroom){
                activeroom.style.color = 'olive';
            }
            tenentDetails.classList.add('detailsVisible');
            e.target.style.color = 'red';
            activeroom = e.target;
        }
        else{
            tenentDetails.classList.toggle('detailsVisible');
            e.target.style.color = e.target.style.color === 'red' ? 'olive' : 'red';
        };
        sendDataToFlask({ owner_id: owner_id, floor_idx: floor_idx, room_idx }, 'POST');
    };

    /* Script for tenent details form */
    let addTenant = document.querySelectorAll(".add-btn");
    let tenentform = document.getElementsByClassName("sub-tenent-form");
    let mainDetails = document.getElementById("mainDetails");
    let tntForm = document.getElementById('myForm');

    function removeError(){
        setSuccess(uName);
        setSuccess(uPhone);
        setSuccess(uEmail);
        setSuccess(uAddress);
        tntForm.reset();
    };

    let addMethod = null;
    addTenant.forEach(function (item) {
        item.addEventListener('click', entryTenant)
    });
    function entryTenant(e){
        removeError();
        addMethod = 'POST';
        editMethod = null;
        addIdx = this.closest('tr').id;
        tenentform[0].style.display = 'block';
        mainDetails.style.justifyContent = 'space-around';
        tntForm.firstElementChild.children[1].focus();
    };

    // Script for close form
    let closeform = document.getElementsByClassName('cls-btn');
    closeform[0].addEventListener('click', function () {
        tenentform[0].style.display = 'none';
        mainDetails.style.justifyContent = 'center';
        removeError();
    });
    
    /* Form validation */
    let uName = document.getElementById('Name');
    let uEmail = document.getElementById('Email');
    let uPhone = document.getElementById('Phone')
    let uAddress = document.getElementById('Address');

    uName.addEventListener('keyup', checkName)
    function checkName(){
        let nameData = uName.value.trim();
        let namePattern = /^[a-zA-Z0-9_-]+$/;
        if(!(nameData === "")){
            if(nameData.length>=3){
                if(Boolean(nameData.match(namePattern))){
                    setSuccess(uName);
                } else{
                    setError(uName, '- Invalid format allow only (a-zA-Z0-9_-)')
                }
            } else{
                setError(uName, '- Length should not be less than 3');
            };
        } else{
            setError(uName, '- Username field should not be empty');
        };
    };

    uEmail.addEventListener('keyup', checkEmail);
    function checkEmail(){
        let emailData = uEmail.value.trim();
        let emailPattern = /^[a-zA-Z0-9_-]+@gmail.com$/;
        if(!(emailData === "")){
            if(emailData.length>=13){
                if(Boolean(emailData.match(emailPattern))){
                    setSuccess(uEmail);
                } else{
                    setError(uEmail, '- Invalid format allow only (a-zA-Z0-9_-)')
                }
            } else{
                setError(uEmail, '- Enter a valid email id');
            };
        } else{
            setError(uEmail, '- Email field should not be empty');
        };
    };

    uAddress.addEventListener('keyup', function(){
        let addressData = uAddress.value.trim();
        if(addressData === ''){
            setError(uAddress, '- Address field should not be empty');
        } else{
            setSuccess(uAddress);
        };
    });

    function setSuccess(input){
        let parentEle = input.parentElement;
        if(parentEle.classList.contains('error')){
            parentEle.lastElementChild.innerText = '';
            parentEle.classList.remove('error')
        };
    };

    function setError(input, message){
        let parentEle = input.parentElement;
        if(!parentEle.classList.contains('error')){
            parentEle.classList.add('error');
        };
        parentEle.lastElementChild.innerText = message;
    };

    tntForm.addEventListener('submit', function (event) {
        let str;
        let setmethod;
        event.preventDefault();
        if (addMethod){
            str = "Confirm add details?";
            setmethod = addMethod;
            row_idx = addIdx;
        }
        else if(editMethod){
            str = "Confirm update details?";
            setmethod = editMethod;
            row_idx = editIdx;
        }
        let confirmation = window.confirm(str)
        if(confirmation){
            let formData = {
                owner_id: owner_id,
                floor_idx: floor_idx,
                room_idx: room_idx,
                row_idx: row_idx,
            
                Name: document.getElementById('Name').value,
                Phone: document.getElementById('Phone').value,
                Email: document.getElementById('Email').value,
                Address: document.getElementById('Address').value
            };
            sendDataToFlask(formData, setmethod);
        };
    });

    /* Render tenants data */
    let tname = document.getElementsByClassName('tname');
    let tphone = document.getElementsByClassName('tphone');
    let temail = document.getElementsByClassName('temail');
    let taddress = document.getElementsByClassName('taddress');
    let tchkin = document.getElementsByClassName('tchkin');
    let tenentObj;
    /* Send data to the flask application */
    async function sendDataToFlask(data, setmethod) {
        // console.log("data sent to flask:", data)
        console.log(setmethod)
        try {
            const response = await fetch('/handle_data', {
                method: setmethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            // console.log(response)
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseData = await response.json();
            // console.log(responseData)
            // console.log(responseData.data)
            if (responseData.status === 'success') {
                tntForm.reset();
    
                tenentform[0].style.display = 'none';
                mainDetails.style.justifyContent = 'center';
    
                if (responseData.data.length !== 0) {
                    tenentObj = responseData.data;
                    // console.log(tenentObj)
                    addData(responseData.data);
                } else {
                    tenentObj = 0;
                    for (let j = 0; j < 4; j++) {
                        tname[j].innerText = 'Add+';
                        tphone[j].innerText = '-';
                        temail[j].innerText = '-';
                        taddress[j].innerText = '-';
                        tchkin[j].innerText = '-';
    
                        if (!tname[j].classList.contains('add-btn')) {
                            tname[j].classList.add('add-btn');
                            tname[j].addEventListener('click', entryTenant)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error receiving data from Flask:', error);
        }
    };

    /* Add data into the table */
    let originalString;
    function addData(data){
        let idx_chk = [];
        for (let k = 0; k<4; k++){
            for (let i=0; i<data.length; i++){
                if(k === data[i]['tenant_number']){
                    tphone[k].innerText = data[i]['phone'];
                    temail[k].innerText = data[i]['email'];
                    taddress[k].innerText = data[i]['address'];
                    tchkin[k].innerText = data[i]['check_in'];
                    originalString = data[i]['name'];
                    tname[k].innerText = originalString.charAt(0).toUpperCase() + originalString.slice(1)
                    tname[k].classList.remove('add-btn');
                    tname[k].removeEventListener('click', entryTenant);
                    idx_chk.push(k)
                }
            };
            if (!idx_chk.includes(k)) {
                tname[k].innerText = 'Add+'
                tphone[k].innerText = '-';
                temail[k].innerText = '-';
                taddress[k].innerText = '-';
                tchkin[k].innerText = '-';
                if(!tname[k].classList.contains('add-btn')){
                    tname[k].classList.add('add-btn');
                    tname[k].addEventListener('click', entryTenant);
                };
            };
        };
    };

    let del_data = document.querySelectorAll('.del-btn');
    let del_idx;

    del_data.forEach(function(item){
        item.addEventListener('click', function(e){
            let confirm = window.confirm("Confirm delete?");
            if(confirm){
                del_idx = e.target.closest('.del-btn').getAttribute('del_index');

                sendDataToFlask({ owner_id: owner_id, floor_idx: floor_idx, room_idx: room_idx, row_idx: del_idx },'DELETE');
            }
        });
    });

    let logout = document.querySelector('.logout');
    logout.addEventListener('click', function(e){
        let confirmLogout = window.confirm("Confirm Logout!");

        if (!confirmLogout) {
            e.preventDefault(); // Prevent the default behavior of the link
        }
    });

    let editData = document.querySelectorAll('.edit-btn');
    let editIdx;
    let editMethod = null;
    editData.forEach(item => {
        item.addEventListener('click', EditData)
    })
    function EditData(e){
        editIdx = +e.target.closest('.rows').getAttribute('id')
        console.log(editIdx)
        if(tenentObj){
            let dataLen = tenentObj.length
            let flag = false;
            for(let i=0; i<dataLen; i++){
                if(tenentObj[i]['tenant_number'] === editIdx){
                    tenentform[0].style.display = 'block';
                    mainDetails.style.justifyContent = 'space-around';
                    uName.value = tenentObj[i]['name'];
                    uPhone.value = tenentObj[i]['phone'];
                    uEmail.value = tenentObj[i]['email'];
                    uAddress.value = tenentObj[i]['address'];
                    flag = true;
                };
            };
            if (flag){
                editMethod = 'PUT';
                addMethod = null;
                flag = false
            }
        };
    };
});