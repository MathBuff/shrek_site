function createParagraph() {
    const para = document.createElement("p");
    para.innerHTML = 'You clicked the button! <span style="color:red">You are a terrible person.</span>';
    document.body.appendChild(para);
}
window.createParagraph = createParagraph;