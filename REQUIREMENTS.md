# Requirements

## About the project

We need to implement mobile friendly web application which would help children learn maths. Topics which the project if focused on are:
- Fractions
- common fractions
- decimal fractions
- Expanding brackets
- grouping terms
- moving terms across the equals sign
- multiplying and dividing equations.

The application should generate random equations, where each term could be:
- a **numeric** (integer, common fraction, impropper fraction, mixed number or decimal fraction)
- a **variable** x (just x or a number mupltiplied by x)
- a bracket (contains one or multiple **numeric** and **variable** terms)
- each term could have sign - or +

The user should be able to interact with the terms
- drag to change the term order
- drag the term across the equals sign, the term sign must change
- expanding brackets by clicking on the bracket, all terms in the bracket should be multiplied by the bracket multiplier
- factoring out a common factor by selecting multiple adjacent terms and entering the factor, the common factor could be a number, a variable or a number multiplied by variable
- grouping numeric/variable terms, by selecting multiple adjacent terms, as a result the sum of the grouped terms should appear instead.
- multiplying/dividing equations by clicking a button and entering an integer number or a fraction which could be negative

The main idea is that performing each operation should give a correct mathimatical result, showing the user how to modify the equation

## Validations

- selecting should be possible only for adjacent terms, so if the terms are not adjacent the user must first to change the order by dragging
- it should be possible to select only term of the same kind, numbers with numbers, variables with variables

## Technical requirements

- the app should be TypeScript using React
- the logic should reside in pure functions, to make it easily testable
- the app should have unit tests
- the React components should be dumb, with the responsibility just to render

## Functionality

### Equation setting

A group of fields that would define what equation to generate
- Quantity of numeric terms, default 2. Miminum 1, maximum 10
- Quantity of variable terms, default 2. Minimum 1, maximum 10
- Variable symbol, default x. Could be any unicode, including emoji
- number of brackets, default 1. Minimun 0, maximum 10. Bracket could be around one, two or more terms, but if it is around one term (the term must be negative).
- use common fractions boolean, default true
- fraction denominator limit, default 10. That mean that the denominator must be >=2 and <= the limit, it is used for common fractions, improper fractions and mixed numbers
- use improper fractions boolean, default false
- use mixed numbers, default true
- use deciamal fractions, default true
- decimal precision, default 3, three digits after the dot, could be from 0 to 10

### Equation generation

- For each bracket define randomly how many terms will go there, should be more that zero, and less than all remaining terms so that at least one term is left without a bracket
- Define randomly bracket multiplier, which must be a numeric multiplyer if bracket contains at least one variable term, or it could be both if the bracket contains only numeric terms. The idea is that the equation must be liniar
- Define randomly each term in the braking including sign (+ or -)
- for each remaining numeric term define randomly the number according to the setting and sign.
- for each remaining variable term define randomly the number and sign and use it togather with the variable
- for each term including bracket terms define randomly position (left or right)
- write the equation
- if one side of the equation does not have any terms, it should have zero term.

### Equation styling

- Font family must be Arial
- Font size 24, bold
- all numeric terms must be black
- all variables terms must be blue
- brackets must be red 

## Equation interaction

- drag to change the term position, any term must be draggable, when a user clicks on the term it is highlighted with the light yellow backgrond, the highlighing includes the sign before the term.
- if the user release it at the same side of the equal sign, the sign before the term does not change
- if the user release it on the other side of the equal sign, the sign nagates
- when user clicks on the brackets he is being asked "expend?" if yes each term in the brackets gets multiplied by the multiplier, multiplication should be calculated
- factoring out a common factor by selecting multiple adjacent terms and entering the factor. The common factor could be a number, a variable or a number multiplied by variable. After selecting multiple terms a button "Factor out" with an "input box" should be visible. 
- grouping numeric/variable terms, by selecting multiple adjacent terms, as a result the sum of the grouped terms should appear instead. After selecting multiple terms of the same type button "Sum" should be visible. On clicking the button the result for selected items should be calculated.
- when selecting terms they must be heighlited including the sign before the term
- multiplying/dividing equations by clicking a button and entering an integer number or a fraction which could be negative. There should be an input which accepts integers and fraction and button "Multiply equation".