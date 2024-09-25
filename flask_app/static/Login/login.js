const submitLogin = document.querySelector("#submitLogin");
const passwordTextBox = document.querySelector("#passwordTextBox");
const userNameTextBox = document.querySelector("#userNameTextBox");
const newUser = document.querySelector("#newUser");

/**
 * When the user summit the login if the input was correct send the user back home
 * Otherwise increments the count of number of time the user input the wrong info
 */
submitLogin.addEventListener("click", () => {
    console.log("Button has been submitted; \n  ${passwordTextBox.value}\\nUserName: ${userNameTextBox.value}");
    var data_d = {'email': userNameTextBox.value, 'password': passwordTextBox.value};
    console.log('data_d', data_d);

    // SEND DATA TO SERVER VIA jQuery.ajax({})
    jQuery.ajax({
        url: "/processlogin",
        data: data_d,
        type: "POST",
        success:function(retruned_data){
              retruned_data = JSON.parse(retruned_data);
              if (retruned_data.success === 1){
                  console.log("in successes funtion");
                  window.location.href = "/home";
              } else {
                  window.location.href = "/login";
              }
            }
    });
});

newUser.addEventListener("click",()=>{
      window.location.href = "/newuser";
});





