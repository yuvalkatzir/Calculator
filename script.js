"use strict"

class Calculator {
    constructor(storeOperandTextElement,currentOperandTextElement) {
        this.inputStack = [];
        this.storeOperandTextElement    = storeOperandTextElement;
        this.currentOperandTextElement  = currentOperandTextElement;
        this.clearData();
        this.updateDisplay();
    }

    clear(){
        this.storeOperandTextElement.innerHTML    = 'Ans = ' + this.Ans + ' | x = ' + this.x + ' | y = ' + this.y;
        this.currentOperandTextElement.innerHTML  = '';
        this.inputStack = [];
        wasAnswered = false;
    }

    delete(){
        if (this.inputStack.length !== 0) {
            if (isNaN(this.inputStack[this.inputStack.length - 1]) &&
                !this.inputStack[this.inputStack.length - 1].includes('.')) {
                this.inputStack.pop();
                return;
            }
            this.inputStack[this.inputStack.length - 1] = this.inputStack[this.inputStack.length - 1].slice(0, -1);
            if(this.inputStack[this.inputStack.length - 1] === ''){
                this.inputStack.pop();
            }
        }
    }

    appendNumber(number) {
        if (isNaN(number)) {
            if (this.inputStack.length !== 0 && !this.inputStack[this.inputStack.length - 1].includes('.'))
                this.inputStack[this.inputStack.length - 1] += '.';
            return;
        }

        if (this.inputStack.length === 0)
            this.inputStack.push(number);
        else if (isNaN(parseFloat(this.inputStack[this.inputStack.length - 1]))) {
            this.inputStack.push(number);
        }
        else if(this.inputStack[this.inputStack.length - 1] === 'Ans' ||
            this.inputStack[this.inputStack.length - 1] === 'x' ||
            this.inputStack[this.inputStack.length - 1] === 'y'){
            return;
        } else this.inputStack[this.inputStack.length - 1] += number;
    }

    chooseOperation(operation){
        if(this.inputStack.length === 0 && operation !== '-')
            return;
        if(this.inputStack.length !== 0 && operation !== '-' && isNaN(this.inputStack[this.inputStack.length - 1])) {
            if (this.inputStack[this.inputStack.length - 1] === 'Ans' ||
                this.inputStack[this.inputStack.length - 1] === 'x' ||
                this.inputStack[this.inputStack.length - 1] === 'y')
                this.inputStack.push(operation);
            return;
        }
        this.inputStack.push(operation);
    }

    compute(lastStore = false){
        if(isNaN(this.inputStack[this.inputStack.length - 1]) &&
            (this.inputStack[this.inputStack.length - 1] !== 'Ans' &&
                this.inputStack[this.inputStack.length - 1] !== 'x' &&
                this.inputStack[this.inputStack.length - 1] !== 'y')){
            this.inputStack.pop();
        }

        if(this.inputStack.length === 0)
            return 0;
        if(this.inputStack[0] === '-')
            this.inputStack.unshift('0');

        this.parser();

        //  calc
        this.calc('*','÷');
        this.calc('+','-');

        if(lastStore === false) {
            this.Ans = parseFloat(this.inputStack[0]);
            this.currentOperandTextElement.innerHTML = this.Ans;
            this.inputStack = [this.Ans];
        } else {
            return parseFloat(this.inputStack[0]);
        }
    }

    parser() {
        for (let i = 0; i < this.inputStack.length; i++) {
            switch (this.inputStack[i]) {
                case 'Ans':
                    this.inputStack[i] = this.Ans;
                    break;
                case 'x':
                    this.inputStack[i] = this.x;
                    break;
                case 'y':
                    this.inputStack[i] = this.y;
                    break;
            }

            if (i + 1 < this.inputStack.length) {
                switch (this.inputStack[i]) {
                    case '+':
                        if (this.inputStack[i + 1] === '-') {
                            this.inputStack = [...this.inputStack.slice(0,i), ...this.inputStack.splice(i + 1)];
                            this.inputStack[i] = '-';
                            i--;
                        } else if(this.inputStack[i - 1] === '*' || this.inputStack[i - 1] === '÷'){
                            this.inputStack = [...this.inputStack.slice(0,i), ...this.inputStack.splice(i + 1)];
                            i--;
                        }
                        break;
                    case '-':
                        if (this.inputStack[i + 1] === '+') {
                            this.inputStack = [...this.inputStack.slice(0,i), ...this.inputStack.splice(i + 1)];
                            this.inputStack[i] = '-';
                            i--;
                        } else if (this.inputStack[i + 1] === '-') {
                            this.inputStack = [...this.inputStack.slice(0,i), ...this.inputStack.splice(i + 1)];
                            this.inputStack[i] = '+';
                            i--;
                        } else if(!isNaN(this.inputStack[i + 1])){
                            this.inputStack[i + 1] = - this.inputStack[i + 1];
                            this.inputStack[i] = '+';
                            if(this.inputStack.length > 1 && (this.inputStack[i - 1] === '*'|| this.inputStack[i - 1] === '÷'))
                                this.inputStack = [...this.inputStack.slice(0,i), ...this.inputStack.splice(i + 1)];
                            i--;
                        }
                        break;
                }
            }
        }
    }

    calc(operator1,operator2){
        let leftNumber;
        let rightNumber;
        let answerStack = [];
        let currentOperator;
        let flagCalcNext = false;

        for(let i = 0;i<this.inputStack.length;i++){
            if(this.inputStack[i] === operator1 || this.inputStack[i] === operator2 || flagCalcNext){
                if(!flagCalcNext)
                    flagCalcNext = true;
                else{
                    currentOperator = answerStack.pop();
                    leftNumber      = answerStack.pop();
                    rightNumber     = this.inputStack[i];
                    flagCalcNext    = false;

                    switch (currentOperator) {
                        case '+': answerStack.push(parseFloat(leftNumber) + parseFloat(rightNumber));
                            break;
                        case '-': answerStack.push(parseFloat(leftNumber) - parseFloat(rightNumber));
                            break;
                        case '*': answerStack.push(parseFloat(leftNumber) * parseFloat(rightNumber));
                            break;
                        case '÷': answerStack.push(parseFloat(leftNumber) / parseFloat(rightNumber));
                            break;
                    }
                    for(i = i + 1;i<this.inputStack.length;i++){
                        answerStack.push(this.inputStack[i]);
                    }
                    this.inputStack = answerStack;
                    answerStack     = [];
                    i=-1;
                    continue;
                }
            }
            answerStack.push(this.inputStack[i]);
        }
        this.inputStack = answerStack;
    }

    appendVariable(variable){
        if(this.inputStack.length !== 0 && (
            this.inputStack[this.inputStack.length - 1] === '+' ||
            this.inputStack[this.inputStack.length - 1] === '-' ||
            this.inputStack[this.inputStack.length - 1] === '*' ||
            this.inputStack[this.inputStack.length - 1] === '÷'))
            this.inputStack.push(variable);
        if(this.inputStack.length === 0)
            this.inputStack.push(variable);
        return;
    }

    store(variable){}

    clearData(){
        this.x   = 0;
        this.y   = 0;
        this.Ans = 0;
        this.clear();
    }

    updateDisplay(){
        let query = '';
        this.inputStack.forEach(item => {if ((isNaN(item) && item !== '.') ? (query += ' ' + item + ' ') : (query += item));});
        this.storeOperandTextElement.innerHTML   = 'Ans = ' + this.Ans + ' | x = ' + this.x + ' | y = ' + this.y;
        this.currentOperandTextElement.innerHTML = query;
    }

    StoreTo(){
        store = true;
        this.currentOperandTextElement.innerHTML = 'Store into X or Y ?';
    }
}

// Buttons
const buttonNumber     = document.querySelectorAll('[data-number]');
const buttonClear      = document.querySelectorAll('[data-clear]');
const buttonOperation  = document.querySelectorAll('[data-operation]');
const buttonStore      = document.querySelectorAll('[data-store]');
const buttonEquals     = document.querySelectorAll('[data-equals]');
const buttonRemoveData = document.querySelectorAll('[data-remove]');
const buttonDelete     = document.querySelectorAll('[data-delete]');
const buttonAnswer     = document.querySelectorAll('[data-answer]');
const buttonX          = document.querySelectorAll('[data-store-x]');
const buttonY          = document.querySelectorAll('[data-store-y]');

// Store used
let store       = false;
let wasAnswered = false;

// Text Elements
const storeOperandTextElement   = document.getElementById("data-store-operand");
const currentOperandTextElement = document.getElementById("data-current-operand");

const calculator = new Calculator(storeOperandTextElement,currentOperandTextElement);

buttonNumber.forEach(button => {
    button.addEventListener('click',()=>{
        if (wasAnswered === true){
            wasAnswered = false;
            calculator.clear();
            calculator.updateDisplay();
        }
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.appendNumber(button.innerHTML);
        calculator.updateDisplay();
    });
});

buttonOperation.forEach(button => {
    button.addEventListener('click',()=>{
        if (wasAnswered === true) {
            wasAnswered = false;
            calculator.clear();
            calculator.appendVariable("Ans");
            calculator.updateDisplay();
        }
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.chooseOperation(button.innerHTML);
        calculator.updateDisplay();
    });
});

buttonClear.forEach(button => {
    button.addEventListener('click',()=>{
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.clear();
        calculator.updateDisplay();
    });
});

buttonRemoveData.forEach(button => {
    button.addEventListener('click',()=>{
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.clearData();
        calculator.updateDisplay();
    });
});

buttonDelete.forEach(button=>{
    button.addEventListener('click',()=>{
        if (wasAnswered === true){
            wasAnswered = false;
        }
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.delete();
        calculator.updateDisplay();
    });
});

buttonEquals.forEach(button=>{
    button.addEventListener('click',()=>{
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.compute();
        calculator.updateDisplay();
        wasAnswered = true;
    });
});

buttonAnswer.forEach(button=>{
    button.addEventListener('click',()=>{
        if (wasAnswered === true){
            wasAnswered = false;
            calculator.clear();
            calculator.updateDisplay();
        }
        if(CheckStore()){
            calculator.clear();
            return;
        }
        calculator.appendVariable("Ans");
        calculator.updateDisplay();
    });
});

buttonStore.forEach(button=>{
    button.addEventListener('click',()=>{
        if (wasAnswered === true) {
            wasAnswered = false;
        }
        calculator.StoreTo();
    });
});

buttonX.forEach(button=>{
    button.addEventListener('click',()=>{
        if (wasAnswered === true){
            wasAnswered = false;
            calculator.clear();
            calculator.updateDisplay();
        }
        if(CheckStore()){
            calculator.x = calculator.compute(true);
            calculator.updateDisplay();
            store = false;
            wasAnswered = true;
            return;
        }
        calculator.appendVariable("x");
        calculator.updateDisplay();
    });
});

buttonY.forEach(button=>{
    button.addEventListener('click',()=>{
        if (wasAnswered === true){
            wasAnswered = false;
            calculator.clear();
            calculator.updateDisplay();
        }
        if(CheckStore()){
            calculator.y = calculator.compute(true);
            calculator.updateDisplay();
            store = false;
            wasAnswered = true;
            return;
        }
        calculator.appendVariable("y");
        calculator.updateDisplay();
    });
});

function CheckStore(){
    if (store === true){
        store = false;
        return true;
    }
    return false;
}