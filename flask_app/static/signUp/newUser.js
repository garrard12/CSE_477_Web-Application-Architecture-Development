



const submitNewUser = document.getElementById("submitNewUser");


submitNewUser.addEventListener("click", () => {
    console.log("Button has been submitted; \n  ${passwordTextBox.value}\\nUserName: ${userNameTextBox.value}");
    var data_d = {'email': userNameTextBox.value, 'password': passwordTextBox.value};
    console.log('data_d', data_d);

    //SEND DATA TO SERVER VIA jQuery.ajax({})
    jQuery.ajax({
        url: "/processnewuser",
        data: data_d,
        type: "POST",
        success:function(retruned_data){
              retruned_data = JSON.parse(retruned_data);
              if (retruned_data.success === 1){
                  console.log("in successes funtion");
                  window.location.href = "/home";
              } else {
                  window.location.href = "/newuser";
              }
            }
    });
});
