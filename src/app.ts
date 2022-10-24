interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable): boolean {
    let isValid = true;

    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid
}


function autobind(target:any,methodName: string, descriptor: PropertyDescriptor) {
    console.log("The target :", target)
    console.log("The method name :", methodName)
    console.log("The descriptor object :", descriptor)

    const originalMethod = descriptor.value
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }

    return adjustedDescriptor
}

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
       
        this.attach()
        this.renderContent()
    }

    private renderContent(){
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }

    private attach(){
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }

    
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
       
        this.configure()
        this.attach()
    }

    // gather user input function
    private gatherUserInput(): [string, string, number ] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle, 
            required: true, 
            minLength: 5
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription, 
            required: true, 
            minLength: 5, 
            maxLength: 50
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople, 
            required: true, 
            max: 5, 
            min: 1
        }


        if(
            !validate(titleValidatable)  ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('Innvalid input, please try again')
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInputs(){
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''

    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput()
        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput
            console.log("The user inputs arre :", title , desc, people)
        }
        this.clearInputs()

    }
    
    private configure(){
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach () {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}


const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')