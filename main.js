const uncompletedSection = document.getElementsByClassName("uncompleted-section")[0];
const addInput = document.getElementById("adding-input");
const addBtn = document.getElementById("adding-btn");
const completedSection = document.getElementsByClassName("completed-section")[0];
const editInput = document.getElementById("edit-input");
const editModal = document.getElementsByClassName("edit-modal")[0];
const todosLengthDisplay = document.getElementById("todos-length");
const completedTodosLengthDisplay = document.getElementById("comp-todos-length");

addBtn.addEventListener("click", addNewTodo);
addInput.addEventListener("keydown", checkKeyType);
editInput.addEventListener("keydown", editSingleTodo);

const theSections = [completedSection, uncompletedSection];
theSections.forEach((section)=>{
  section.addEventListener("dragover", completedDragOver)
  section.addEventListener("dragleave", completedDragLeave)
  section.addEventListener("drop", completedDrop)
})

let editIdTracker=0;
let transferElement;
let allTodos=[

]

function elementCreator(tag, id, value){
  const element = document.createElement(tag);
  if(id) element.id = id;
  if(value) element.innerText = value;

  return element;
}

function singleTodoCreator(todoValue, identifier){
  const todoBox = elementCreator("div", "single-todo");
  todoBox.draggable = true;
  todoBox.setAttribute("data-iden", identifier);
  todoBox.addEventListener("dragstart", onSingleDrag)
  
  const completedBox = elementCreator("div", "completed-box");
  todoBox.appendChild(completedBox);

  const todoText = elementCreator("p", null, todoValue);
  completedBox.appendChild(todoText);

  const singleEdit = elementCreator("button", "single-edit", "Edit");
  singleEdit.addEventListener("click", initiateEdit)
  completedBox.appendChild(singleEdit)

  const singleDelete = elementCreator("button", "single-delete", "Delete");
  singleDelete.addEventListener("click", deleteSingleTodo)
  completedBox.appendChild(singleDelete);

  const completedSeal = elementCreator("div", "completed-seal");
  todoBox.appendChild(completedSeal);

  const sealDeleteBtn = elementCreator("button", "seal-delete", "Delete");
  sealDeleteBtn.addEventListener("click", deleteSingleTodo)
  completedSeal.appendChild(sealDeleteBtn);
  

  return todoBox;
}

function renderAllTodos(){
  uncompletedSection.innerHTML = "";
  completedSection.innerHTML = "";

  allTodos.forEach((item)=>{
    const {id, text, isCompleted}= item;
    const singleTodo = singleTodoCreator(text, id);

    if(!isCompleted){
      uncompletedSection.appendChild(singleTodo);
    }else{
      completedSection.appendChild(singleTodo)
    }
  })
}


function addNewTodo(){
  const randomIdentifier = Math.floor(Math.random() * 1000000).toString();

  const template = {
    id:randomIdentifier,
    text: addInput.value,
    isCompleted: false,
  }

  allTodos.push(template);
  const singleTodo = singleTodoCreator(addInput.value, randomIdentifier);

  uncompletedSection.appendChild(singleTodo);

  addInput.value = ""; // clears the text in the input;

  calculateDoneTodo()
}

function checkKeyType(e){
  if(e.key === 'Enter') addNewTodo()
}

function getIdentifier(e){
  const singleEdit = e.currentTarget;
  const theParent = singleEdit.parentElement.parentElement;
  const parentIdentifier = theParent.dataset.iden;
  return parentIdentifier
}

function searchForTheTodoIndex(identifier){
  const todoIndex = allTodos.findIndex((item)=> item.id === identifier);
  return todoIndex;
}

function deleteSingleTodo(e){
  // search for the todo with the identifier
  const parentIdentifier = getIdentifier(e);
  const foundIndex  = searchForTheTodoIndex(parentIdentifier);

  // delete the single todo from DOM
  const theDelBtn = e.currentTarget;
  const presentElement = theDelBtn.parentElement.parentElement;
  const isCompleted = allTodos[foundIndex].isCompleted;
  if(isCompleted){
    completedSection.removeChild(presentElement);
  }else{
    uncompletedSection.removeChild(presentElement);
  }

  // delete from data
  allTodos.splice(foundIndex, 1);

  calculateDoneTodo()
}

function initiateEdit(e){
  const parentIdentifier = getIdentifier(e);

  // search for todo identifier
  const foundIndex = searchForTheTodoIndex(parentIdentifier);
  editIdTracker = foundIndex;
  const foundText = allTodos[foundIndex].text;
  editInput.value = foundText;

  editModal.classList.remove("closed");  
}

function editSingleTodo(e){
  if(e.key === 'Enter'){
    allTodos[editIdTracker].text = e.currentTarget.value;
    renderAllTodos();
    editModal.classList.add("closed");
    editInput.value ="";
  }
}

function onSingleDrag(e){
  const theTodo = e.currentTarget;
  const identifier = theTodo.dataset.iden;

  e.dataTransfer.setData("theIden", identifier);
  transferElement = theTodo;
}

function completedDragOver(e){
  e.preventDefault();
  e.currentTarget.classList.add("hovering");
}

function completedDragLeave(e){
  e.preventDefault();
  e.currentTarget.classList.remove("hovering");
}

function completedDrop(e){
  completedDragLeave(e);
  const theIden = e.dataTransfer.getData("theIden");
  transferBetweenSection(theIden, e)
}

function transferBetweenSection(identifier, e){
  // search for the the identifier in allTodos
  const foundIndex = searchForTheTodoIndex(identifier);
  const foundTodo = allTodos[foundIndex];

  if(e.currentTarget.classList.contains("completed-section")){
    foundTodo.isCompleted = true;
  }else{
    foundTodo.isCompleted = false;
  }

  e.currentTarget.appendChild(transferElement);
  calculateDoneTodo()
}


function calculateDoneTodo(){
  todosLengthDisplay.innerText = allTodos.length;
  const filteredCompleted = allTodos.filter((todo)=> todo.isCompleted === true);
  completedTodosLengthDisplay.innerText = filteredCompleted.length;
}

calculateDoneTodo()
