const feedback = document.querySelector(".feedback");
const popUpForm = document.querySelector(".popUpForm")

feedback.addEventListener("click",()=>{
  console.log("feedback clicked");
  if (popUpForm.style.opacity === "0" || popUpForm.style.opacity === "") {
  popUpForm.style.opacity = "1";
  popUpForm.style.zIndex = "9999";
} else {
  popUpForm.style.opacity = "0";
  popUpForm.style.zIndex = "-1";
}
})